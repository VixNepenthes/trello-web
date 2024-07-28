export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/*
  Khi Column rỗng cần tạo card đặc biệt placeholdercard
  card này sẽ ẩn ở giao diện ui người dùng
*/

export const generatePlacehoderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}
