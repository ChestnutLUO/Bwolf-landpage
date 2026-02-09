/// <reference types="@cloudflare/workers-types" />
import postgres from "postgres";

const ROOM_ID = 8432038;

const CACHE_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=30, s-maxage=30, stale-while-revalidate=30",
};

interface Env {
  HYPERDRIVE?: { connectionString: string };
  DATABASE_URL?: string;
}

function getConnectionString(env: Env): string {
  if (env.HYPERDRIVE?.connectionString) {
    return env.HYPERDRIVE.connectionString;
  }
  if (env.DATABASE_URL) {
    return env.DATABASE_URL;
  }
  throw new Error("No database connection configured");
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const sql = postgres(getConnectionString(context.env), {
    max: 1,
    idle_timeout: 0,
  });

  try {
    const [roomResult, sessionsResult, viewerResult, danmakuResult, socialResult] =
      await Promise.all([
        // Q1: Room info + current live session
        sql`
          SELECT r.uname, r.title, r.cover,
                 ls.id AS session_id, ls.start_time, ls.peak_online, ls.avg_online,
                 ls.titles AS session_titles, ls.areas AS session_areas, ls.status
          FROM rooms r
          LEFT JOIN live_sessions ls
            ON ls.room_id = r.room_id AND ls.status = 'live'
          WHERE r.room_id = ${ROOM_ID}
          LIMIT 1
        `,

        // Q2: Recent 5 sessions
        sql`
          SELECT id, start_time, end_time, peak_online, avg_online, titles, areas
          FROM live_sessions
          WHERE room_id = ${ROOM_ID}
          ORDER BY start_time DESC
          LIMIT 5
        `,

        // Q3: Viewer records downsampled to ~20 points (latest session)
        sql`
          WITH latest_session AS (
            SELECT id FROM live_sessions
            WHERE room_id = ${ROOM_ID}
            ORDER BY start_time DESC
            LIMIT 1
          ),
          numbered AS (
            SELECT recorded_at, online_count, viewer_count,
                   NTILE(20) OVER (ORDER BY recorded_at) AS bucket
            FROM viewer_records
            WHERE session_id = (SELECT id FROM latest_session)
          )
          SELECT
            to_char(MIN(recorded_at) AT TIME ZONE 'Asia/Shanghai', 'HH24:MI') AS time,
            ROUND(AVG(online_count))::int AS value
          FROM numbered
          GROUP BY bucket
          ORDER BY bucket
        `,

        // Q4: Danmaku 5-min buckets (last 4 hours)
        sql`
          SELECT
            to_char(
              date_trunc('hour', timestamp AT TIME ZONE 'Asia/Shanghai')
              + INTERVAL '5 min' * FLOOR(
                  EXTRACT(MINUTE FROM timestamp AT TIME ZONE 'Asia/Shanghai') / 5
                ),
              'HH24:MI'
            ) AS time,
            COUNT(*)::int AS value,
            COUNT(DISTINCT user_id)::int AS value2
          FROM danmaku_messages
          WHERE room_id = ${ROOM_ID}
            AND timestamp > NOW() - INTERVAL '4 hours'
          GROUP BY 1
          ORDER BY 1
        `,

        // Q5: Latest follower + medal counts
        sql`
          SELECT
            (SELECT follower_count FROM follower_records
             WHERE room_id = ${ROOM_ID} ORDER BY recorded_at DESC LIMIT 1) AS followers,
            (SELECT medal_count FROM medal_records
             WHERE room_id = ${ROOM_ID} ORDER BY recorded_at DESC LIMIT 1) AS medals
        `,
      ]);

    const room = roomResult[0];
    const isLive = room?.status === "live";

    const data = {
      room: {
        uname: room?.uname ?? "",
        title: room?.title ?? "",
        cover: room?.cover ?? "",
      },
      is_live: isLive,
      session: isLive && room?.session_id
        ? {
            id: room.session_id,
            start_time: room.start_time,
            end_time: null,
            peak_online: room.peak_online ?? 0,
            avg_online: room.avg_online ?? 0,
            titles: room.session_titles ?? "",
            areas: room.session_areas ?? "",
          }
        : null,
      recent_sessions: sessionsResult.map((s: any) => ({
        id: s.id,
        start_time: s.start_time,
        end_time: s.end_time,
        peak_online: s.peak_online ?? 0,
        avg_online: s.avg_online ?? 0,
        titles: s.titles ?? "",
        areas: s.areas ?? "",
      })),
      viewer_chart: viewerResult.map((r: any) => ({
        time: r.time,
        value: r.value ?? 0,
      })),
      danmaku_chart: danmakuResult.map((r: any) => ({
        time: r.time,
        value: r.value ?? 0,
        value2: r.value2 ?? 0,
      })),
      followers: socialResult[0]?.followers ?? 0,
      medals: socialResult[0]?.medals ?? 0,
    };

    context.waitUntil(sql.end());
    return new Response(JSON.stringify(data), { headers: CACHE_HEADERS });
  } catch (err: any) {
    context.waitUntil(sql.end());
    return new Response(
      JSON.stringify({ error: err.message ?? "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};