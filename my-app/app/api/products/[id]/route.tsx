import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const filePath = path.join(process.cwd(), "database", "products.json");

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        const products = JSON.parse(data);
        const product = products.find((item: any) => item.id === Number(params.id));

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch the product" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const productReq = await req.json();
        const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const findIndex = products.findIndex((product: any) => product.id === Number(params.id));

        if (findIndex !== -1) {
            products[findIndex] = { ...products[findIndex], ...productReq };
            fs.writeFileSync(filePath, JSON.stringify(products), "utf8");
            return NextResponse.json({ message: "Product updated successfully" });
        } else {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ error: "Failed to update the product" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const findIndex = products.findIndex((product: any) => product.id === Number(params.id));

        if (findIndex !== -1) {
            products.splice(findIndex, 1);
            fs.writeFileSync(filePath, JSON.stringify(products), "utf8");
            return NextResponse.json({ message: "Product deleted successfully" });
        } else {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: "Failed to delete the product" }, { status: 500 });
    }
}
