'use client'
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"

export default function ManageProducts() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/store/product")
            const data = await response.json()
            if (response.ok) {
                setProducts(data.products)
            }
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
    }

    const toggleStock = async (productId) => {
        try {
            const response = await fetch("/api/store/stock-toggle", {
                method: "POST",
                body: JSON.stringify({ productId })
            })
            const data = await response.json()
            if (response.ok) {
                toast.success(data.message)
                fetchProducts()
            }
        } catch (error) {
            console.error("Error toggling stock:", error)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return !loading ? (
        <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12">
            <h1 className="text-2xl font-medium text-slate-800">Quản lý sản phẩm</h1>
            <div className="mt-8 flex flex-col gap-4">
                <div className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] gap-4 p-4 bg-slate-50 text-slate-500 text-sm font-medium">
                    <p>Hình ảnh</p>
                    <p>Tên</p>
                    <p>Giá</p>
                    <p>Kho hàng</p>
                    <p className="text-center">Thao tác</p>
                </div>
                {products.length ? products.map((product) => (
                    <div key={product.id} className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] gap-4 p-4 items-center border border-slate-100 text-slate-600 text-sm">
                        <Image src={product.images[0]} alt="" width={50} height={50} className="w-12 h-12 object-cover rounded border" />
                        <p className="font-medium">{product.name}</p>
                        <p>{currency}{product.price}</p>
                        <p className={product.inStock ? "text-green-600" : "text-red-600"}>{product.inStock ? "Còn hàng" : "Hết hàng"}</p>
                        <button onClick={() => toggleStock(product.id)} className="text-indigo-600 hover:text-indigo-800 font-medium text-center">Bật/Tắt kho hàng</button>
                    </div>
                )) : (
                    <p className="text-center py-20 text-slate-400">Không tìm thấy sản phẩm nào</p>
                )}
            </div>
        </div>
    ) : <Loading />
}
