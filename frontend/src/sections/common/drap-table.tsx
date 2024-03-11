import { MenuOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useEffect, useState } from 'react';
import { TableCustom } from "../../components";

export default function DrapTable({columnsTable, datasTable, keyPros, onDragRowEvent}) {
    const columns = columnsTable;
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        datasTable.forEach(element => {
            element.key = `${element[keyPros]}`;
        });
        setDataSource(datasTable);
    }, [datasTable]);

    const Row = ({ children, ...props }) => {
        const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
        } = useSortable({
        id: props['data-row-key'],
        });
        const style = {
        ...props.style,
        transform: CSS.Transform.toString(
            transform && {
            ...transform,
            scaleY: 1,
            },
        ),
        transition,
        ...(isDragging
            ? {
                position: 'relative',
                zIndex: 9999,
            }
            : {}),
        };
        return (
        <tr {...props} ref={setNodeRef} style={style} {...attributes}>
            {React.Children.map(children, (child) => {
            if (child.key === 'sort') {
                return React.cloneElement(child, {
                children: (
                    <MenuOutlined
                    ref={setActivatorNodeRef}
                    style={{
                        touchAction: 'none',
                        cursor: 'move',
                    }}
                    {...listeners}
                    />
                ),
                });
            }
            return child;
            })}
        </tr>
        );
    };
    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            setDataSource((previous) => {
                const activeIndex = previous.findIndex((i) => i.key === active.id);
                const overIndex = previous.findIndex((i) => i.key === over?.id);
                let arrNew = arrayMove(previous, activeIndex, overIndex);
                for(let i = 0; i < arrNew.length; i++){
                    arrNew[i].key = `${i+1}`;
                    arrNew[i][keyPros] = `${i+1}`;
                }
                onDragRowEvent(arrNew);
                return arrNew;
            });
        }
        
    };
    return (
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
            // rowKey array
            items={dataSource.map((i) => i.key)}
            strategy={verticalListSortingStrategy}
        >
            <TableCustom
                components={{
                    body: {
                    row: Row,
                    },
                }}
                rowKey="key"
                columns={columns}
                dataSource={dataSource}
            />
        </SortableContext>
        </DndContext>
    );
};