import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import React from 'react'

export async function GET(req: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), "database/products.json");
    const data = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(data);

    const searchParams = req.nextUrl.searchParams;
    const name = searchParams.get('name');

    if (name) {
      const filteredProducts = products.filter((product: any) =>
        product.name.toLowerCase().includes(name.toLowerCase())
      );
      return NextResponse.json(filteredProducts);
    }
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userReq = await req.json()
    const filePath = path.join(process.cwd(), "database", "products.json")
    const products = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    products.push(userReq)
    fs.writeFileSync(filePath, JSON.stringify(products), "utf8")
    return NextResponse.json({ message: "Ghi file thành công" })
} catch (error) {
    return NextResponse.json({ message: "Ghi file thất bại" })
}
}