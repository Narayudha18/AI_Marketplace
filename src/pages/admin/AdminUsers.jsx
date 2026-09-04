import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserProfileModal from '../../components/UserProfileModal'

export default function AdminUsers({ users, approveSeller, toggleSellerStatus, deleteUser }) {
  const navigate = useNavigate()
  const [selectedUser, setSelectedUser] = useState(null)

  return (
    <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">All Users</h2>
        <span className="text-[11px] text-text-muted/70">{users.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-text-muted/70 bg-surface-container-low/50">
              <th className="text-left py-3 px-5 font-semibold">User</th>
              <th className="text-left py-3 px-5 font-semibold">Email</th>
              <th className="text-left py-3 px-5 font-semibold">Role</th>
              <th className="text-right py-3 px-5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
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
                <td className="py-3.5 px-5">
                  <div className="flex gap-1">
                    {u.isAdmin && <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-bold">Admin</span>}
                    {u.isSeller && !u.isAdmin && <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold">Seller</span>}
                    {u.sellerRequested && <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-bold">Pending</span>}
                    {!u.isAdmin && !u.isSeller && !u.sellerRequested && <span className="bg-surface-container text-text-muted px-2 py-0.5 rounded-full text-[10px] font-bold">Buyer</span>}
                  </div>
                </td>
                <td className="py-3.5 px-5 text-right">
                  {!u.isAdmin && (
                    <div className="flex gap-1.5 justify-end">
                      <button onClick={() => setSelectedUser(u)}
                        className="text-[10px] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">View</button>
                      {!u.isSeller ? (
                        <button onClick={() => { if (window.confirm(`Approve ${u.name} as seller?`)) approveSeller(u.id) }}
                          className="text-[10px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold px-2 py-1 rounded-md transition-colors cursor-pointer">Make Seller</button>
                      ) : (
                        <button onClick={() => { if (window.confirm(`Revoke seller status from ${u.name}?`)) toggleSellerStatus(u.id) }}
                          className="text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold px-2 py-1 rounded-md transition-colors cursor-pointer">Revoke</button>
                      )}
                      <button onClick={() => { if (window.confirm(`Delete user ${u.name}? This cannot be undone.`)) deleteUser(u.id) }}
                        className="text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold px-2 py-1 rounded-md transition-colors cursor-pointer">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedUser && (
        <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  )
}
