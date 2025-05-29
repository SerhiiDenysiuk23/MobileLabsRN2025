export function formatTodoDate(date: Date) {
  return `${date.toLocaleDateString()} о ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}