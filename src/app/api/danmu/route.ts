import { NextResponse } from 'next/server';

import { getAvailableDanmuApiSites, getCacheTime } from '@/lib/config';
import { searchFromDanmuApi } from '@/lib/downstream';

export const runtime = 'edge';

//
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  // const resourceId = searchParams.get('resourceId');
  const resourceId = 'netlify';
  if (!query || !resourceId) {
    const cacheTime = await getCacheTime();
    return NextResponse.json(
      { result: null, error: '缺少必要参数: q 或 resourceId' },
      {
        headers: {
          'Cache-Control': `public, max-age=${cacheTime}`,
        },
      }
    );
  }

  const apiSites = await getAvailableDanmuApiSites();

  try {
    // 根据 resourceId 查找对应的 API 站点
    const targetSite = apiSites.find((site) => site.key === resourceId);
    if (!targetSite) {
      return NextResponse.json(
        {
          error: `未找到指定的弹幕源: ${resourceId}`,
          result: null,
        },
        { status: 404 }
      );
    }

    const results = await searchFromDanmuApi(targetSite, query);
    // todo
    const result = results.filter((r) => r.title.includes(query));
    const cacheTime = await getCacheTime();

    return NextResponse.json(
      { results: result },
      {
        headers: {
          'Cache-Control': `public, max-age=${cacheTime}`,
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: '搜索失败',
        results: [],
      },
      { status: 500 }
    );
  }
}
