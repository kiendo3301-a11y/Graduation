'use client'
import { storesDummyData } from "@/assets/assets"
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminApprove() {

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)


    const fetchStores = async () => {
        try {
            const response = await fetch("/api/admin/stores")
            const data = await response.json()
            if (response.ok) {
                // Filter only stores that are pending
                setStores(data.stores.filter(s => s.status === 'pending'))
            }
        } catch (error) {
            console.error("Error fetching stores:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async ({ storeId, status }) => {
        try {
            const response = await fetch("/api/admin/approve", {
                method: "POST",
                body: JSON.stringify({ storeId, status })
            })
            const data = await response.json()
            if (response.ok) {
                toast.success(data.message)
                fetchStores() // Refresh the list
            } else {
                toast.error(data.error)
                throw new Error(data.error)
            }
        } catch (error) {
            console.error("Error approving store:", error)
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    return !loading ? (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">Phê duyệt <span className="text-slate-800 font-medium">Cửa hàng</span></h1>

            {stores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white border rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions */}
                            <div className="flex gap-3 pt-2 flex-wrap">
                                <button onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'approved' }), { loading: "đang phê duyệt" })} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm" >
                                    Phê duyệt
                                </button>
                                <button onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'rejected' }), { loading: 'đang từ chối' })} className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm" >
                                    Từ chối
                                </button>
                            </div>
                        </div>
                    ))}

                </div>) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">Không có yêu cầu nào đang chờ</h1>
                </div>
            )}
        </div>
    ) : <Loading />
}