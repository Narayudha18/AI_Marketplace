import { useNavigate } from 'react-router-dom'

export default function AdminSellers({ sellers, pendingSellers, sellerProducts, approveSeller, rejectSeller, toggleSellerStatus }) {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {pendingSellers.length > 0 && (
        <div className="bg-surface border border-amber-500/20 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border-light flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 16 }}>hourglass_empty</span>
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">Pending Approval ({pendingSellers.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-text-muted/70 bg-surface-container-low/50">
                  <th className="text-left py-3 px-5 font-semibold">User</th>
                  <th className="text-left py-3 px-5 font-semibold">Email</th>
                  <th className="text-right py-3 px-5 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingSellers.map((u, i) => (
                  <tr key={i} className="border-t border-border-light">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{u.name[0].toUpperCase()}</span>
                        <span className="font-semibold text-text-main">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-text-muted">{u.email}</td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <button onClick={() => navigate(`/admin/preview/seller/${u.id}`)} className="text-[10px] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">View</button>
                        <button onClick={() => approveSeller(u.id)} className="text-[10px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">Approve</button>
                        <button onClick={() => { if (window.confirm(`Reject seller request from ${u.name}?`)) rejectSeller(u.id) }} className="text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">Active Sellers</h2>
          <span className="text-[11px] text-text-muted/70">{sellers.length} registered</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text-muted/70 bg-surface-container-low/50">
                <th className="text-left py-3 px-5 font-semibold">Seller</th>
                <th className="text-left py-3 px-5 font-semibold">Email</th>
                <th className="text-left py-3 px-5 font-semibold">Products</th>
                <th className="text-right py-3 px-5 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-text-muted/70">No approved sellers yet.</td></tr>
              ) : (
                sellers.map((u, i) => {
                  const productCount = sellerProducts.filter(p => p.sellerId === u.id).length
                  return (
                    <tr key={i} className="border-t border-border-light hover:bg-surface-container-low transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {u.picture ? <img src={u.picture} alt="" className="w-full h-full object-cover" /> : u.name?.[0]?.toUpperCase() || 'U'}
                          </span>
                          <span className="font-semibold text-text-main">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-text-muted">{u.email}</td>
                      <td className="py-3.5 px-5 text-text-main/90">{productCount}</td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button onClick={() => navigate(`/admin/preview/seller/${u.id}`)}
                            className="text-[10px] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">View</button>
                          <button onClick={() => { if (window.confirm(`Revoke seller status from ${u.name}?`)) toggleSellerStatus(u.id) }}
                            className="text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">Revoke</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
