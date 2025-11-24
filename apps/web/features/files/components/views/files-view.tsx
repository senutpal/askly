"use client";

import { api } from "@workspace/backend/_generated/api";
import type { PublicFile } from "@workspace/backend/private/files";
import {
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	InfiniteScrollTrigger,
	Separator,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	useInfiniteScroll,
} from "@workspace/ui";
import { usePaginatedQuery } from "convex/react";
import { motion } from "motion/react";
import {
	FileIcon,
	FileText,
	FolderOpen,
	GlobeIcon,
	MoreHorizontalIcon,
	PlusIcon,
	TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { DeleteFileDialog } from "../delete-file-dialog";
import { UploadDialog } from "../upload-dialog";
import { WebCrawlerDialog } from "../web-crawler-dialog";

export const FilesView = () => {
	const files = usePaginatedQuery(
		api.private.files.list,
		{},
		{
			initialNumItems: 10,
		},
	);

	const {
		topElementRef,
		handleLoadMore,
		canLoadMore,
		isLoadingFirstPage,
		isLoadingMore,
	} = useInfiniteScroll({
		status: files.status,
		loadMore: files.loadMore,
		loadSize: 10,
	});

	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const [crawlerDialogOpen, setCrawlerDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null);

	const handleDeleteClick = (file: PublicFile) => {
		setSelectedFile(file);
		setDeleteDialogOpen(true);
	};

	const handleFileDeleted = () => {
		setSelectedFile(null);
	};

	return (
    <><div className="h-full w-full bg-background dark:bg-neutral-900">
      <div className="max-w-6xl mx-auto">
        <DeleteFileDialog
          onOpenChange={setDeleteDialogOpen}
          open={deleteDialogOpen}
          file={selectedFile}
          onDeleted={handleFileDeleted}
        />
        <UploadDialog
          onOpenChange={setUploadDialogOpen}
          open={uploadDialogOpen}
        />
        <WebCrawlerDialog
          onOpenChange={setCrawlerDialogOpen}
          open={crawlerDialogOpen}
        />
        <div className="min-h-screen   py-6 md:py-12">
          <div className=" space-y-12">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
            >
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                  Manage your <br />
                  <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                    documents
                  </span>
                </h1>
                <p className="max-w-md text-lg text-muted-foreground">
                  Upload and organize files to train your AI assistant effectively.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background"
                  onClick={() => setCrawlerDialogOpen(true)}
                >
                  <GlobeIcon className="mr-2 h-4 w-4" />
                  Crawl Website
                </Button>
                <Button
                  size="lg"
                  className="h-12 rounded-xl shadow-lg shadow-primary/20"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add New File
                </Button>
              </div>
            </motion.div>

            <Separator className="bg-border/50" />

            {/* Files Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl dark:bg-black/20"
            >
              <div className="bg-background/50">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/50">
                      <TableHead className="px-6 py-4 font-medium">Name</TableHead>
                      <TableHead className="px-6 py-4 font-medium">Type</TableHead>
                      <TableHead className="px-6 py-4 font-medium">Size</TableHead>
                      <TableHead className="px-6 py-4 font-medium text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      if (isLoadingFirstPage) {
                        return (
                          <TableRow>
                            <TableCell className="h-32 text-center" colSpan={4}>
                              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                Loading Files...
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      }
                      if (files.results.length === 0) {
                        return (
                          <TableRow>
                            <TableCell className="h-64 text-center" colSpan={4}>
                              <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                  <FileText className="h-8 w-8 opacity-50" />
                                </div>
                                <p>No files uploaded yet</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      }

                      return files.results.map((file) => (
                        <TableRow
                          className="group border-border/50 transition-colors hover:bg-muted/50"
                          key={file.id}
                        >
                          <TableCell className="px-6 py-4 font-semibold">
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <FileIcon className="h-5 w-5" />
                              </div>
                              <span className="text-base">{file.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Badge
                              className="rounded-md bg-muted px-2 py-1 font-mono text-xs font-normal text-muted-foreground hover:bg-muted"
                              variant="secondary"
                            >
                              {file.type.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-muted-foreground font-mono text-sm">
                            {file.size}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
                                  size="sm"
                                  variant="ghost"
                                >
                                  <MoreHorizontalIcon className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteClick(file)}
                                >
                                  <TrashIcon className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ));
                    })()}
                  </TableBody>
                </Table>
              </div>
              {!isLoadingFirstPage && files.results.length > 0 && (
                <div className="border-t border-border/50 bg-background/30 p-4">
                  <InfiniteScrollTrigger
                    canLoadMore={canLoadMore}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={handleLoadMore}
                    ref={topElementRef}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
		</>
	);
};
