import React, { useState } from 'react';
import { getHelpArticles } from '../../data/helpContent';
import type { HelpArticle } from '../../types/onboarding';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { useTranslations } from '../../i18n';
import './HelpCenterPage.css';

type ArticleCategory = 'getting_started' | 'gameplay' | 'systems' | 'faq';

const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  getting_started: '#ff9999',
  gameplay: '#99ccff',
  systems: '#99ff99',
  faq: '#ffcc99',
};

export const HelpCenterPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const language = useLanguageStore((s) => s.language);
  const tr = useTranslations();
  const helpArticles = getHelpArticles(language);

  // 筛选文章
  const filteredArticles = helpArticles.filter((article) => {
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: ArticleCategory[] = ['getting_started', 'gameplay', 'systems', 'faq'];
  const categoriesWithCount = categories.map((cat) => ({
    category: cat,
    count: helpArticles.filter((a) => a.category === cat).length,
  }));

  return (
    <div className="help-center-page">
      <div className="help-header">
        <h1>📚 {tr.helpCenter.title}</h1>
        <p>{tr.helpCenter.subtitle}</p>
      </div>

      {!selectedArticle ? (
        <div className="help-content">
          {/* 搜索框 */}
          <div className="help-search">
            <input
              type="text"
              placeholder={tr.helpCenter.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="help-layout">
            {/* 左侧分类 */}
            <div className="help-sidebar">
              <div className="category-section">
                <h3>{tr.helpCenter.sidebarCategory}</h3>
                <button
                  className={`category-btn ${!selectedCategory ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  {tr.helpCenter.allArticles} ({helpArticles.length})
                </button>
                {categoriesWithCount.map(({ category, count }) => (
                  <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      borderLeftColor: CATEGORY_COLORS[category],
                    }}
                  >
                    {tr.helpCenter.categories[category]} ({count})
                  </button>
                ))}
              </div>
            </div>

            {/* 中央文章列表 */}
            <div className="help-articles">
              {filteredArticles.length === 0 ? (
                <div className="empty-state">
                  <p>{tr.helpCenter.emptyStateTitle}</p>
                  <small>{tr.helpCenter.emptyStateSubtitle}</small>
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="article-card"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div className="article-header">
                      <h3 className="article-title">{article.title}</h3>
                      <span className="article-category">
                        {tr.helpCenter.categories[article.category]}
                      </span>
                    </div>
                    <p className="article-preview">
                      {article.content.substring(0, 100)}...
                    </p>
                    <div className="article-footer">
                      <span className="read-time">
                        {tr.helpCenter.readTime.replace('{minutes}', String(article.estimatedReadTime))}
                      </span>
                      <span className="read-link">{tr.helpCenter.viewDetails}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="article-view">
          <button
            className="back-btn"
            onClick={() => setSelectedArticle(null)}
          >
            {tr.helpCenter.backBtn}
          </button>

          <article className="article-content">
            <div className="article-meta">
              <h2>{selectedArticle.title}</h2>
              <div className="article-info">
                <span className="category-badge">
                  {tr.helpCenter.categories[selectedArticle.category]}
                </span>
                <span className="read-time">
                  {tr.helpCenter.readTimeDetail.replace('{minutes}', String(selectedArticle.estimatedReadTime))}
                </span>
              </div>
            </div>

            <div className="article-body">
              {selectedArticle.content.split('\n\n').map((paragraph, index) => {
                // 处理加粗的段落
                if (paragraph.startsWith('**')) {
                  return (
                    <p key={index} className="section-title">
                      {paragraph.replace(/\*\*/g, '')}
                    </p>
                  );
                }
                // 处理列表项
                if (paragraph.startsWith('- ')) {
                  return (
                    <ul key={index} className="content-list">
                      {paragraph.split('\n').map((item, i) => (
                        <li key={i}>{item.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  );
                }
                // 处理数字列表
                if (paragraph.match(/^\d+️⃣/)) {
                  return (
                    <ol key={index} className="content-list">
                      {paragraph.split('\n').map((item, i) => (
                        <li key={i}>{item.replace(/^\d+️⃣\s*/, '').replace(/^\s+/, '')}</li>
                      ))}
                    </ol>
                  );
                }
                return (
                  <p key={index} className="content-paragraph">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {selectedArticle.relatedTopics && selectedArticle.relatedTopics.length > 0 && (
              <div className="article-related">
                <h4>{tr.helpCenter.relatedTopics}</h4>
                <div className="related-links">
                  {selectedArticle.relatedTopics.map((topicId) => {
                    const relatedArticle = helpArticles.find((a) => a.id === topicId);
                    return relatedArticle ? (
                      <button
                        key={topicId}
                        className="related-link"
                        onClick={() => setSelectedArticle(relatedArticle)}
                      >
                        {relatedArticle.title}
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </article>
        </div>
      )}
    </div>
  );
};

