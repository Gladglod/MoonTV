import React from 'react';
import { useState } from 'react';

import { DanmuResult, EpisodeItem } from '@/lib/types';

interface DanmuSelectorProps {
  danmuSources?: DanmuResult[];
  danmuSearchLoading?: boolean;
  /** 当前选中的 episodeId（可选） */
  value?: number;
  /** 选中 episodeId 后的回调 */
  onChange?: (episodeId: number) => void;
}

/**
 * 弹幕选择组件
 * 样式和“换源”那一块保持一致：卡片式列表，当前选中项高亮
 */
const DanmuSelector: React.FC<DanmuSelectorProps> = ({
  danmuSources = [],
  danmuSearchLoading,
  value,
  onChange,
}) => {
  /** 当前进入的源（null 表示正在显示源列表） */
  const [activeSource, setActiveSource] = useState<DanmuResult | null>(null);

  /** 返回上一级 */
  const handleBack = () => setActiveSource(null);

  /** 点击某个源，进入下一层 */
  const handleSourceClick = (source: DanmuResult) => {
    setActiveSource(source);
  };

  /** 点击某一集，触发 onChange */
  const handleEpisodeClick = (episode: EpisodeItem) => {
    onChange?.(episode.episodeId);
  };
  return (
    <div className='flex flex-col h-full'>
      {/* 加载 */}
      {danmuSearchLoading && (
        <div className='flex items-center justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-500' />
          <span className='ml-2 text-sm text-gray-600 dark:text-gray-300'>
            弹幕源搜索中…
          </span>
        </div>
      )}

      {/* 无数据 */}
      {!danmuSearchLoading && danmuSources.length === 0 && (
        <div className='flex items-center justify-center py-8'>
          <div className='text-center'>
            <div className='text-gray-400 text-2xl mb-2'>💬</div>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              暂无可用弹幕源
            </p>
          </div>
        </div>
      )}

      {/* ============================ */}
      {/* 一级：源列表（anime 列表） */}
      {/* ============================ */}
      {!danmuSearchLoading && !activeSource && danmuSources.length > 0 && (
        <div className='flex-1 overflow-y-auto space-y-2 pb-4'>
          {danmuSources.map((source) => {
            return (
              <div
                key={source.id}
                onClick={() => handleSourceClick(source)}
                className={`
                    flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
                    hover:bg-gray-200/50 dark:hover:bg-white/10 hover:scale-[1.02]
                  `.trim()}
              >
                {/* 图标 */}
                <div className='flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-200'>
                  源
                </div>

                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between'>
                    <h3 className='font-medium text-sm truncate text-gray-900 dark:text-gray-100'>
                      {source.title}
                    </h3>
                  </div>

                  <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    {source.episodes.length} 集弹幕
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================ */}
      {/* 二级：某个源的 episodes 列表 */}
      {/* ============================ */}
      {activeSource && (
        <div className='flex-1 flex flex-col overflow-y-auto pb-4'>
          {/* 返回上一级 */}
          <button
            onClick={handleBack}
            className='text-left mb-3 text-sm text-gray-600 dark:text-gray-300 hover:text-green-500'
          >
            ← 返回
          </button>

          <h2 className='text-base font-medium text-gray-900 dark:text-gray-100 mb-3'>
            {activeSource.title} 的弹幕集数
          </h2>

          <div className='space-y-2'>
            {activeSource.episodes.map((ep: EpisodeItem) => {
              const isActive = ep.episodeId === value;

              return (
                <div
                  key={ep.episodeId}
                  onClick={() => handleEpisodeClick(ep)}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all duration-200
                    ${
                      isActive
                        ? 'bg-green-500/20 border border-green-500/40'
                        : 'hover:bg-gray-200/50 dark:hover:bg-white/10'
                    }
                  `.trim()}
                >
                  <span
                    className={`
                      text-sm font-medium
                      ${
                        isActive
                          ? 'text-green-600 dark:text-green-300'
                          : 'text-gray-800 dark:text-gray-200'
                      }
                    `}
                  >
                    {ep.episodeTitle}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DanmuSelector;
