'use client'
import { useState } from "react"
import { assets, categories } from "@/assets/assets"
import Image from "next/image"
import toast from "react-hot-toast"

export default function AddProduct() {
    const [images, setImages] = useState([])
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        category: categories[0],
        price: "",
        offerPrice: ""
    })

    const onChangeHandler = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value })
    }

    const onImageChange = (e) => {
        const files = Array.from(e.target.files)
        setImages([...images, ...files])
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", productData.name)
        formData.append("description", productData.description)
        formData.append("category", productData.category)
        formData.append("price", productData.price)
        formData.append("offerPrice", productData.offerPrice)

        images.forEach((img) => {
            formData.append("images", img)
        })

        const loadingToast = toast.loading("Đang thêm sản phẩm...")
        try {
            const response = await fetch("/api/store/product", {
                method: "POST",
                body: formData
            })
            const data = await response.json()
            if (response.ok) {
                toast.success(data.message, { id: loadingToast })
                setProductData({ name: "", description: "", category: categories[0], price: "", offerPrice: "" })
                setImages([])
            } else {
                toast.error(data.error, { id: loadingToast })
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi", { id: loadingToast })
        }
    }

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-medium text-slate-800">Thêm sản phẩm</h1>
            <form onSubmit={onSubmitHandler} className="mt-8 flex flex-col gap-4 text-slate-600">
                <p>Hình ảnh sản phẩm</p>
                <div className="flex flex-wrap gap-3">
                    {images.map((img, index) => (
                        <div key={index} className="relative group">
                            <Image src={URL.createObjectURL(img)} alt="" width={100} height={100} className="w-24 h-24 object-cover rounded border" />
                            <button type="button" onClick={() => setImages(images.filter((_, i) => i !== index))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full size-5 text-xs opacity-0 group-hover:opacity-100 transition">x</button>
                        </div>
                    ))}
                    <label className="cursor-pointer">
                        <div className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-slate-300 rounded hover:border-slate-400 transition">
                            <Image src={assets.upload_area} alt="" width={40} height={40} />
                        </div>
                        <input type="file" onChange={onImageChange} hidden multiple accept="image/*" />
                    </label>
                </div>

                <p>Tên sản phẩm</p>
                <input name="name" onChange={onChangeHandler} value={productData.name} type="text" placeholder="Nhập tại đây" className="border border-slate-300 outline-none p-2.5 rounded max-w-lg" required />

                <p>Mô tả sản phẩm</p>
                <textarea name="description" onChange={onChangeHandler} value={productData.description} rows={4} placeholder="Viết nội dung tại đây" className="border border-slate-300 outline-none p-2.5 rounded max-w-lg resize-none" required />

                <div className="flex flex-wrap gap-5">
                    <div>
                        <p>Danh mục</p>
                        <select name="category" onChange={onChangeHandler} value={productData.category} className="border border-slate-300 outline-none p-2.5 rounded w-44">
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <p>Giá sản phẩm</p>
                        <input name="price" onChange={onChangeHandler} value={productData.price} type="number" placeholder="0" className="border border-slate-300 outline-none p-2.5 rounded w-44" required />
                    </div>
                    <div>
                        <p>Giá ưu đãi (Tùy chọn)</p>
                        <input name="offerPrice" onChange={onChangeHandler} value={productData.offerPrice} type="number" placeholder="0" className="border border-slate-300 outline-none p-2.5 rounded w-44" />
                    </div>
                </div>

                <button className="bg-slate-800 text-white px-10 py-2.5 rounded mt-5 hover:bg-slate-900 transition w-fit">Thêm sản phẩm</button>
            </form>
        </div>
    )
}
