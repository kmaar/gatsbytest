import { MobileMenuItemProps } from '@postidigital/posti-components'

const innerSearch = (tree: MobileMenuItemProps): MobileMenuItemProps => {
  if (tree.selected) {
    return tree
  }

  for (const child of tree.children) {
    const found = innerSearch(child)
    if (found) {
      return found
    }
  }
}

export const getSelectedItem = (tree: MobileMenuItemProps[]) => {
  let result
  for (const t of tree) {
    result = innerSearch(t)
    if (result) {
      break
    }
  }
  return result
}

export function getParent(tree: MobileMenuItemProps[], id: string) {
  let node

  tree.some(function (n) {
    if (n.id === id) {
      return (node = n)
    }
    if (n.children) {
      return (node = getParent(n.children, id))
    }
  })
  return node || null
}