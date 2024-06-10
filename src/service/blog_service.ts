import { EntityNotFoundException, InternalServerErrorException } from "../util/global_exception";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import blog_schema from "../schema/blog_schema";
import { get } from "http";

const prisma = new PrismaClient()

const add_blog = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const blog_data = blog_schema.create.parse(req.body);
        const file = await prisma.file.findUnique({where: {id: blog_data.fileId}});
        if(file!=null && req.user != null){
            const blog = await prisma.blog.create({
                data: {
                    title: blog_data.title,
                    content: blog_data.content,
                    authorId: req.user.id,
                    fileId: blog_data.fileId,
                    imageUrl: file.secureUrl
                }
            });
            res.status(200).json({message: "Blog created successfully", blog});
        }
        throw new EntityNotFoundException("File not found");
    } catch (error) {
        next(error);
    }
}

const get_all_blog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const totalBlogs = await prisma.blog.count();

        const blogs = await prisma.blog.findMany({
            skip,
            take: limit,
            include: { author: {select: {username: true}} }
        });

        const totalPages = Math.ceil(totalBlogs / limit);

        res.status(200).json({
            totalBlogs,
            totalPages,
            currentPage: page,
            blogs,
        });
    } catch (error) {
        next(error);
    }
}

const get_blog_by_id = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const blog = await prisma.blog.findUnique({
            where: { id },
            include: { author: {select: {username: true}} }
        });
        if(!blog){
            throw new EntityNotFoundException(`Blog with id - ${id} not found`);
        }
        res.status(200).json({message: "Success", blog});
    } catch (error) {
        next(error);
    }

}

export default {
    add_blog, get_all_blog, get_blog_by_id
}