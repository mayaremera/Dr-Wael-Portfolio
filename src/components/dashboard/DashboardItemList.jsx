import { useEffect, useState } from 'react'
import { useConfirmDelete } from './DeleteConfirmDialog'

export const DASHBOARD_PAGE_SIZE = 5

export function useDashboardPagination(items, pageSize = DASHBOARD_PAGE_SIZE) {
  const [page, setPage] = useState(0)
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(page, pageCount - 1)

  useEffect(() => {
    if (page > pageCount - 1) {
      setPage(Math.max(0, pageCount - 1))
    }
  }, [page, pageCount])

  const needsPagination = items.length > pageSize
  const pageItems = needsPagination
    ? items.slice(safePage * pageSize, safePage * pageSize + pageSize)
    : items

  return {
    pageItems,
    page: safePage,
    setPage,
    pageCount,
    needsPagination,
    pageSize,
  }
}

export function DashboardPagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null

  return (
    <div className="mt-5 border-t border-slate-200/80 pt-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/25 hover:text-brand disabled:pointer-events-none disabled:opacity-35"
        >
          Previous
        </button>

        {Array.from({ length: pageCount }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onPageChange(index)}
            aria-current={index === page ? 'true' : undefined}
            className={`h-8 min-w-8 rounded-lg border px-2 text-xs font-semibold transition-colors ${
              index === page
                ? 'border-brand bg-brand text-white'
                : 'border-slate-200 bg-white text-ink-muted hover:border-brand/25 hover:text-brand'
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount - 1}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/25 hover:text-brand disabled:pointer-events-none disabled:opacity-35"
        >
          Next
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-ink-muted">
        Page <span className="font-semibold text-brand">{page + 1}</span> of {pageCount}
      </p>
    </div>
  )
}

export default function DashboardItemList({
  title,
  countLabel,
  items,
  editingId,
  onAdd,
  onEdit,
  onDelete,
  renderPreview,
  renderEditor,
  getItemId,
  addLabel = 'Add',
  emptyMessage = 'No items yet.',
  addEditorPosition = 'top',
  renderItem,
  deleteTitle = 'Delete this item?',
  deleteMessage = 'This action cannot be undone. Are you sure you want to delete it?',
  pageSize = DASHBOARD_PAGE_SIZE,
}) {
  const confirmDelete = useConfirmDelete()
  const { pageItems, page, setPage, pageCount, needsPagination, pageSize: activePageSize } = useDashboardPagination(
    items,
    pageSize,
  )

  const handleDelete = (id) => {
    confirmDelete({
      title: deleteTitle,
      message: deleteMessage,
      onConfirm: () => onDelete(id),
    })
  }

  useEffect(() => {
    if (!editingId || editingId === 'new') return

    const index = items.findIndex((item) => getItemId(item) === editingId)
    if (index >= 0) {
      setPage(Math.floor(index / pageSize))
    }
  }, [editingId, getItemId, items, activePageSize, setPage])

  useEffect(() => {
    if (editingId === 'new' && addEditorPosition === 'bottom' && items.length > 0) {
      setPage(Math.max(0, pageCount - 1))
    }
  }, [editingId, addEditorPosition, items.length, pageCount, setPage])

  return (
    <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-ink">{title}</h2>
          <p className="mt-1 text-sm text-ink-muted">{countLabel}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light"
        >
          {addLabel}
        </button>
      </div>

      {editingId === 'new' && addEditorPosition === 'top' ? (
        <div className="mt-5">{renderEditor('new')}</div>
      ) : null}

      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <p className="rounded-lg bg-surface-alt px-4 py-6 text-center text-sm text-ink-muted">{emptyMessage}</p>
        ) : (
          pageItems.map((item) =>
            renderItem ? (
              <div key={getItemId(item)}>{renderItem(item)}</div>
            ) : (
              <article key={getItemId(item)} className="overflow-hidden rounded-lg border border-slate-200/80 bg-surface-alt/60">
                <div className="h-1 bg-brand" aria-hidden="true" />
                <div className="p-4">
                  {editingId === getItemId(item) ? (
                    renderEditor(item)
                  ) : (
                    <>
                      {renderPreview(item)}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(getItemId(item))}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:border-brand/25"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(getItemId(item))}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-hover uppercase transition-colors hover:border-accent/30"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </article>
            ),
          )
        )}
      </div>

      {needsPagination ? (
        <DashboardPagination page={page} pageCount={pageCount} onPageChange={setPage} />
      ) : null}

      {editingId === 'new' && addEditorPosition === 'bottom' ? (
        <div className="mt-5">{renderEditor('new')}</div>
      ) : null}
    </section>
  )
}
