// Sort Columns and Cards
export const mapOder = (originalArray, orderArray, key) => {
  if (!originalArray || !orderArray || !key) return []
  return [...originalArray].sort(
    (a, b) =>
      orderArray.indexOf(a[key]) -
      orderArray.indexOf(b[key])
  )
  //   const cloneArray = [...originalArray]
  //   const orderedArray = cloneArray.sort((a, b) => {
  //     return (
  //       orderArray.indexOf(a[key]) -
  //       orderArray.indexOf(b[key])
  //     )
  //   })
  //   return orderedArray
}
