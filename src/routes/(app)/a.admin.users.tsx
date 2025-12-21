import { createFileRoute } from '@tanstack/react-router'
import { Shield, ShieldAlert, User as UserIcon, MoreVertical, Ban, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAllUsers, useToggleBan, useUpdateUserRole } from '@/lib/queries/admin'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Route = createFileRoute('/(app)/a/admin/users')({
  component: AdminUsers,
})

function AdminUsers() {
  const { data: users, isLoading } = useAllUsers()
  const toggleBanMutation = useToggleBan()
  const updateRoleMutation = useUpdateUserRole()

  const handleToggleBan = async (id: string, isBanned: boolean) => {
    try {
      await toggleBanMutation.mutateAsync(id)
      toast.success(isBanned ? "User berhasil di-unban" : "User berhasil di-ban")
    } catch (error) {
      toast.error("Gagal mengubah status ban")
    }
  }

  const handleUpdateRole = async (id: string, role: string) => {
    try {
      await updateRoleMutation.mutateAsync({ id_user: id, role })
      toast.success(`Role user diubah menjadi ${role}`)
    } catch (error) {
      toast.error("Gagal mengubah role user")
    }
  }

  return (
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Manajemen User</CardTitle>
        <p className="text-sm text-muted-foreground">Kelola hak akses dan status akun pengguna.</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">Loading users...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Poin</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id_user}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === 'admin' ? 'destructive' : user.role === 'moderator' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.is_banned ? (
                      <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">Banned</Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">Aktif</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{user.poin}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Pengaturan User</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {/* Change Role Submenu */}
                        <DropdownMenuItem onClick={() => handleUpdateRole(user.id_user, 'user')}>
                          <UserIcon className="mr-2 h-4 w-4" /> Set as User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateRole(user.id_user, 'moderator')}>
                          <Shield className="mr-2 h-4 w-4" /> Set as Moderator
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateRole(user.id_user, 'admin')} className="text-red-600">
                          <ShieldAlert className="mr-2 h-4 w-4" /> Set as Admin
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Ban/Unban */}
                        <DropdownMenuItem
                          onClick={() => handleToggleBan(user.id_user, user.is_banned)}
                          className={user.is_banned ? "text-green-600" : "text-red-600"}
                        >
                          {user.is_banned ? (
                            <><UserCheck className="mr-2 h-4 w-4" /> Unban User</>
                          ) : (
                            <><Ban className="mr-2 h-4 w-4" /> Ban User</>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
