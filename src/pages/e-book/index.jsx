import React, { useMemo, useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import PerformanceMonitor from '../../components/ui/PerformanceMonitor';
import Icon from '../../components/AppIcon';
import BlockRenderer from './components/BlockRenderer';
import { generateLargeBlockData } from './components/blockData';

const Ebook = () => {
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);
  const [visibleCount, setVisibleCount] = useState(40);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const largeData = generateLargeBlockData(500);
      setBlocks(largeData);
      setIsLoading(false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 1200;
      if (nearBottom) {
        setVisibleCount((prev) => Math.min(prev + 40, blocks?.length || 0));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [blocks?.length]);

  const handleDragStart = (blockId) => {
    setDraggedBlock(blockId);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
  };

  const handleDrop = (e, targetId) => {
    e?.preventDefault();
    if (!draggedBlock || draggedBlock === targetId) return;

    const draggedIndex = blocks?.findIndex(b => b?.id === draggedBlock);
    const targetIndex = blocks?.findIndex(b => b?.id === targetId);
    
    const newBlocks = [...blocks];
    const [removed] = newBlocks?.splice(draggedIndex, 1);
    newBlocks?.splice(targetIndex, 0, removed);
    
    setBlocks(newBlocks);
    setDraggedBlock(null);
  };

  const handleBlockEdit = (blockId, newContent) => {
    setEditingBlock(blockId);
    setBlocks((prev) =>
      prev?.map((block) =>
        block?.id === blockId ? { ...block, content: newContent } : block
      )
    );
  };

  const visibleBlocks = useMemo(() => blocks?.slice(0, visibleCount), [blocks, visibleCount]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <PerformanceMonitor />
        <main className="pt-[76px] flex items-center justify-center h-screen">
          <div className="text-center">
            <Icon name="Loader2" className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading blocks (this will take a while)...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PerformanceMonitor />
      <main className="pt-[76px] pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <Icon name="AlertTriangle" className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">E book</h1>
                <p className="text-muted-foreground mt-1">Not a book</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {visibleBlocks?.map((block) => (
              <div
                key={block?.id}
                draggable
                onDragStart={() => handleDragStart(block?.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, block?.id)}
                className={`transition-all ${
                  draggedBlock === block?.id ? 'opacity-50' : ''
                } ${
                  editingBlock === block?.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <BlockRenderer
                  block={block}
                  onEdit={(content) => handleBlockEdit(block?.id, content)}
                  isEditing={editingBlock === block?.id}
                />
              </div>
            ))}

            {visibleCount < blocks?.length && (
              <div className="pt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Rendering {visibleBlocks?.length} of {blocks?.length} blocks...
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Ebook;