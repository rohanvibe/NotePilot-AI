"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export default function KnowledgeGraph() {
    const { notes, relationships } = useStore();
    const router = useRouter();
    const fgRef = useRef<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const graphData = useMemo(() => {
        if (!mounted) return { nodes: [], links: [] };

        // Create nodes
        const nodes: any[] = notes.map(note => ({
            id: note.id,
            name: note.name,
            val: 1,
            topic: note.topic || 'Uncategorized',
            type: 'note'
        }));

        // Group unique topics
        const topics = Array.from(new Set(notes.map(n => n.topic || 'Uncategorized')));
        topics.forEach(topic => {
            if (!nodes.find(n => n.id === topic)) {
                nodes.push({
                    id: topic,
                    name: topic,
                    val: 2,
                    type: 'topic'
                });
            }
        });

        // Create links
        const links: any[] = [];

        // Link notes to their topics
        notes.forEach(note => {
            links.push({
                source: note.id,
                target: note.topic || 'Uncategorized',
                type: 'belongs_to'
            });
        });

        // Add explicit relationships from store
        relationships.forEach(rel => {
            links.push({
                source: rel.source,
                target: rel.target,
                type: rel.type
            });
        });

        return { nodes, links };
    }, [notes, relationships, mounted]);

    if (!mounted) return <div className="w-full h-full flex items-center justify-center">Loading Graph...</div>;

    return (
        <div className="w-full h-[600px] bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden relative">
            <ForceGraph2D
                ref={fgRef}
                graphData={graphData}
                nodeLabel="name"
                nodeAutoColorBy="topic"
                linkDirectionalParticles={1}
                linkDirectionalParticleSpeed={() => 0.01}
                onNodeClick={(node: any) => {
                    if (node.type === 'note') {
                        router.push(`/dashboard?noteId=${node.id}`);
                    }
                }}
                nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Inter, sans-serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions: [number, number] = [textWidth, fontSize].map(n => n + fontSize * 0.2) as [number, number];

                    ctx.fillStyle = node.type === 'topic' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(31, 41, 55, 0.8)';
                    ctx.beginPath();
                    ctx.roundRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1], 2);
                    ctx.fill();

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#fff';
                    ctx.fillText(label, node.x, node.y);

                    node.__bckgDimensions = bckgDimensions;
                }}
                nodePointerAreaPaint={(node: any, color, ctx) => {
                    ctx.fillStyle = color;
                    const bckgDimensions = node.__bckgDimensions;
                    if (bckgDimensions) {
                        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
                    }
                }}
            />
        </div>
    );
}
