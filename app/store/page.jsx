'use client'
import { useEffect, useState } from "react"
import { dummyStoreDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"

export default function StoreDashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchDashboardData = async () => {
        try {
            const response = await fetch("/api/store/dashboard")
            const data = await response.json()
            if (response.ok) {
                setStats(data.stats)
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    return !loading ? (
        <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
            <h1 className="text-2xl font-medium text-slate-800">Dashboard</h1>
            <div className="flex flex-wrap gap-5 mt-5">
                <div className="flex-1 min-w-[200px] p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-slate-500">Total Revenue</p>
                    <h2 className="text-3xl font-semibold text-slate-800">${stats?.totalRevenue || 0}</h2>
                </div>
                <div className="flex-1 min-w-[200px] p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-slate-500">Total Orders</p>
                    <h2 className="text-3xl font-semibold text-slate-800">{stats?.totalOrders || 0}</h2>
                </div>
                <div className="flex-1 min-w-[200px] p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-slate-500">Total Products</p>
                    <h2 className="text-3xl font-semibold text-slate-800">{stats?.totalProducts || 0}</h2>
                </div>
            </div>
        </div>
    ) : <Loading />
}
