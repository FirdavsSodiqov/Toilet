import { useState, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";

/**
 * FilterShell component with interactive filter chips.
 */
export default function FilterShell({
  filters = { status: "all", price: "all", type: "all" },
  onFilterChange,
  resultCount = 0,
}) {
  const { t } = useLanguage();
  const [expandedGroup, setExpandedGroup] = useState(null);

  const FILTER_GROUPS = [
    {
      key: "status",
      label: t("filter_status"),
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      options: [
        { value: "all", label: t("filter_all") },
        { value: "open", label: t("status_open"), color: "var(--status-open)" },
        { value: "limited", label: t("status_limited"), color: "var(--status-limited)" },
        { value: "closed", label: t("status_closed"), color: "var(--status-closed)" },
      ],
    },
    {
      key: "price",
      label: t("filter_price"),
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
      options: [
        { value: "all", label: t("filter_all") },
        { value: "free", label: t("price_free") },
        { value: "paid", label: t("price_paid") },
      ],
    },
    {
      key: "type",
      label: t("filter_type"),
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      options: [
        { value: "all", label: t("filter_all") },
        { value: "public", label: t("type_public") },
        { value: "premium", label: t("type_premium") },
        { value: "paid", label: t("type_paid") },
      ],
    },
  ];

  const handleFilterSelect = useCallback(
    (groupKey, value) => {
      const newFilters = { ...filters, [groupKey]: value };
      onFilterChange?.(newFilters);
    },
    [filters, onFilterChange]
  );

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== "all"
  ).length;

  const clearAllFilters = useCallback(() => {
    onFilterChange?.({ status: "all", price: "all", type: "all" });
    setExpandedGroup(null);
  }, [onFilterChange]);

  return (
    <div className="filter-shell" role="toolbar" aria-label={t("filter_title")}>
      <div className="filter-shell-header">
        <div className="filter-shell-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>{t("filter_title")}</span>
          {activeFilterCount > 0 && (
            <span className="filter-count-badge">{activeFilterCount}</span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            className="filter-clear-btn"
            onClick={clearAllFilters}
            aria-label={t("filter_clear")}
          >
            {t("filter_clear")}
          </button>
        )}
      </div>

      <div className="filter-groups">
        {FILTER_GROUPS.map((group) => (
          <div key={group.key} className="filter-group">
            <button
              className={`filter-group-toggle ${
                expandedGroup === group.key ? "active" : ""
              } ${filters[group.key] !== "all" ? "has-selection" : ""}`}
              onClick={() =>
                setExpandedGroup(
                  expandedGroup === group.key ? null : group.key
                )
              }
              aria-expanded={expandedGroup === group.key}
              aria-controls={`filter-${group.key}`}
            >
              {group.icon}
              <span>{group.label}</span>
              {filters[group.key] !== "all" && (
                <span className="filter-active-dot" />
              )}
            </button>

            {expandedGroup === group.key && (
              <div
                className="filter-chips"
                id={`filter-${group.key}`}
                role="radiogroup"
                aria-label={group.label}
              >
                {group.options.map((opt) => (
                  <button
                    key={opt.value}
                    className={`filter-chip ${
                      filters[group.key] === opt.value ? "filter-chip--active" : ""
                    }`}
                    onClick={() => handleFilterSelect(group.key, opt.value)}
                    role="radio"
                    aria-checked={filters[group.key] === opt.value}
                    style={
                      opt.color && filters[group.key] === opt.value
                        ? { borderColor: opt.color, color: opt.color }
                        : {}
                    }
                  >
                    {opt.color && (
                      <span
                        className="chip-color-dot"
                        style={{ background: opt.color }}
                      />
                    )}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="filter-result-count">
        <span className="result-count-number">{resultCount}</span>
        <span className="result-count-label">{t("filter_results")}</span>
      </div>
    </div>
  );
}
