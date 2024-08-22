"use client";
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface Product {
  id: number;
  product_name: string;
  image: string;
  price: number;
  quantity: number;
}

const VND = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [inputValue, setInputValue] = useState({
    product_name: '',
    image: '',
    price: 0,
    quantity: 0,
  });
  const [errors, setErrors] = useState({
    product_name: '',
    image: '',
    price: '',
    quantity: '',
  });

  const fetchData = () => {
    axios.get("http://localhost:3000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const newErrors: any = {};
    let isValid = true;

    if (!inputValue.product_name.trim()) {
      newErrors.product_name = 'Tên sản phẩm không được để trống';
      isValid = false;
    }
    if (!inputValue.image.trim()) {
      newErrors.image = 'Thiếu URL ảnh';
      isValid = false;
    }
    if (!inputValue.price || isNaN(Number(inputValue.price))) {
      newErrors.price = 'Giá sản phẩm không được để trống';
      isValid = false;
    }
    if (!inputValue.quantity || isNaN(Number(inputValue.quantity))) {
      newErrors.quantity = 'Số lượng sản phẩm phải lớn hơn 0';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddClick = () => {
    if (!validateInputs()) return;

    const maxId = products.length > 0 ? Math.max(...products.map(product => product.id)) : 0;

    const newProduct = {
      id: maxId + 1,
      ...inputValue,
    };

    axios.post("http://localhost:3000/api/products", newProduct)
      .then(res => {
        setProducts(prevProducts => [...prevProducts, newProduct]);
        resetForm();
        alert('Thêm sản phẩm thành công!');
      })
      .catch(err => {
        console.error("API Error:", err);
        alert('Failed to add product');
      });
  };

  const handleUpdateClick = () => {
    if (!validateInputs()) return;

    if (!editingProduct) return;

    const updatedProduct = {
      ...editingProduct,
      ...inputValue,
    };

    axios.put(`http://localhost:3000/api/products/${editingProduct.id}`, updatedProduct)
      .then(() => {
        setProducts(prevProducts => prevProducts.map(product =>
          product.id === editingProduct.id ? updatedProduct : product
        ));
        resetForm();
        alert('Cập nhật sản phẩm thành công!');
      })
      .catch(err => {
        console.error("API Error:", err);
        alert('Failed to update product');
      });
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setInputValue({
      product_name: product.product_name,
      image: product.image,
      price: product.price,
      quantity: product.quantity,
    });
  };

  const resetForm = () => {
    setEditingProduct(null);
    setInputValue({
      product_name: '',
      image: '',
      price: 0,
      quantity: 0,
    });
    setErrors({
      product_name: '',
      image: '',
      price: '',
      quantity: '',
    });
  };

  const handleDeleteClick = (id: number) => {
    const isConfirmed = window.confirm("Bạn muốn xóa sản phẩm này chứ?");
    if (isConfirmed) {
      axios.delete(`http://localhost:3000/api/products/${id}`)
        .then(() => {
          setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
          alert('Xóa sản phẩm thành công!');
        })
        .catch(err => {
          console.log(err);
          alert('Failed to delete product');
        });
    } else {
      alert('Xóa sản phẩm thất bại');
    }
  };

  return (
    <div className='flex gap-10 p-5'>
      <div className='w-[60%]'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='font-bold text-center'>STT</TableHead>
              <TableHead className='font-bold text-center'>Tên sản phẩm</TableHead>
              <TableHead className='font-bold text-center'>Hình ảnh</TableHead>
              <TableHead className='font-bold text-center'>Giá</TableHead>
              <TableHead className='font-bold text-center'>Số lượng</TableHead>
              <TableHead className='font-bold text-center'>Chức năng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell className='text-center'>{index + 1}</TableCell>
                <TableCell className='text-center'>{product.product_name}</TableCell>
                <TableCell><img src={product.image} width={100} className='rounded' /></TableCell>
                <TableCell className='text-center'>{VND.format(product.price)}</TableCell>
                <TableCell className='text-center'>{product.quantity}</TableCell>
                <TableCell className='text-center'>
                  <Button className='mr-3' variant={"secondary"} onClick={() => handleEditClick(product)}>Sửa</Button>
                  <Button variant={"destructive"} onClick={() => handleDeleteClick(product.id)}>Xóa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='w-[30%] flex flex-col gap-5 p-6 border-[1px]'>
        <strong className='text-center'>{editingProduct ? 'Sửa thông tin sản phẩm' : 'Thêm mới sản phẩm'}</strong>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="product_name">Tên</Label>
          <Input
            onChange={handleChange}
            className='w-full'
            type="text"
            name="product_name"
            value={inputValue.product_name}
          />
          {errors.product_name && <p className='text-red-500 text-sm'>{errors.product_name}</p>}
          <Label htmlFor="image">Hình ảnh</Label>
          <Input
            onChange={handleChange}
            className='w-full'
            type="text"
            name="image"
            value={inputValue.image}
          />
          {errors.image && <p className='text-red-500 text-sm'>{errors.image}</p>}
          <Label htmlFor="price">Giá</Label>
          <Input
            onChange={handleChange}
            className='w-full'
            type="text"
            name="price"
          />
          {errors.price && <p className='text-red-500 text-sm'>{errors.price}</p>}
          <Label htmlFor="quantity">Số lượng</Label>
          <Input
            onChange={handleChange}
            className='w-full'
            type="number"
            name="quantity"
            min={1}
            defaultValue={1}
          />
          {errors.quantity && <p className='text-red-500 text-sm'>{errors.quantity}</p>}
          <Button
            variant={'primary'}
            onClick={editingProduct ? handleUpdateClick : handleAddClick}
          >
            {editingProduct ? 'Cập nhật' : 'Thêm'}
          </Button>
        </div>
      </div>
    </div>
  );
}
