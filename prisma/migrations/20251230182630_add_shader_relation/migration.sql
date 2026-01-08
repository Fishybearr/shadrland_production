-- CreateTable
CREATE TABLE "Shader" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled Shader',
    "shaderText" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Shader_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shader" ADD CONSTRAINT "Shader_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
