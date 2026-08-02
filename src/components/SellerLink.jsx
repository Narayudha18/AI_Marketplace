import { useNavigate } from 'react-router-dom'
import { getUserById } from '../lib/storage'
import { getSellerIdByAuthor } from '../data/seed-sellers'

export default function SellerLink({ sellerId, author }) {
  const navigate = useNavigate()
  const id = sellerId || getSellerIdByAuthor(author)
  if (!id) return null
  const name = getUserById(id)?.name || author || 'Seller'
  return (
    <span
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/seller/${id}`) }}
      className="text-primary hover:underline cursor-pointer"
    >
      {name}
    </span>
  )
}
