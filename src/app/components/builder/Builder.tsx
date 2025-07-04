'use client';

import { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { v4 as uuidv4 } from 'uuid';
import PlotlyChart from '../charts/PlotlyChart';
import Draggable from 'react-draggable';

const COMPONENTS = [
  { type: 'line', label: 'Line Chart' },
  { type: 'bar', label: 'Bar Chart' },
  { type: 'scatter', label: 'Scatter Plot' },
  { type: 'pie', label: 'Pie Chart' },
  { type: 'dropdown', label: 'Dropdown' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'text', label: 'Text Input' },
  { type: 'button', label: 'Button' },
  { type: 'date', label: 'Date Picker' },
  { type: 'radio', label: 'Radio Group' },
  { type: 'slider', label: 'Slider' },
];

const DEFAULT_PROPS: Record<string, any> = {
  line: { label: 'Line Chart', color: '#3B82F6', width: 400, height: 300 },
  bar: { label: 'Bar Chart', color: '#F59E42', width: 400, height: 300 },
  scatter: { label: 'Scatter Plot', color: '#10B981', width: 400, height: 300 },
  pie: { label: 'Pie Chart', color: '#F43F5E', width: 400, height: 300 },
  dropdown: { label: 'Dropdown', options: ['Option 1', 'Option 2'], width: 200, height: 60 },
  checkbox: { label: 'Checkbox', checked: false, width: 200, height: 60 },
  text: { label: 'Text Input', value: '', width: 200, height: 60 },
  button: { label: 'Button', color: '#6366F1', width: 200, height: 60 },
  date: { label: 'Date Picker', width: 200, height: 60 },
  radio: { label: 'Radio Group', options: ['A', 'B'], width: 200, height: 60 },
  slider: { label: 'Slider', min: 0, max: 100, value: 50, width: 200, height: 60 },
};

function DraggableComponent({ type, label, setDraggingType }: { type: string; label: string; setDraggingType?: (type: string | null) => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { type },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: () => setDraggingType && setDraggingType(null),
  }));
  return (
    <div
      ref={node => { if (node) drag(node); }}
      className={`p-2 bg-white rounded shadow cursor-move border-4 border-gray-700 hover:border-blue-400 mb-2 transition-all duration-150 ${isDragging ? 'opacity-50 border-blue-500' : ''}`}
      style={{ marginBottom: 8, textAlign: 'center', fontWeight: 500 }}
    >
      {label}
    </div>
  );
}

function RenderComponent({ comp, isSelected, onDelete, onChange }: any) {
  let content = null;
  switch (comp.type) {
    case 'line':
      content = (
        <PlotlyChart
          data={[{ x: [1, 2, 3, 4], y: [10, 15, 13, 17], type: 'scatter', mode: 'lines+markers', marker: { color: comp.props.color } }]}
          layout={{ title: comp.props.label, width: comp.props.width, height: comp.props.height }}
        />
      );
      break;
    case 'bar':
      content = (
        <PlotlyChart
          data={[{ x: ['A', 'B', 'C', 'D'], y: [20, 14, 23, 25], type: 'bar', marker: { color: comp.props.color } }]}
          layout={{ title: comp.props.label, width: comp.props.width, height: comp.props.height }}
        />
      );
      break;
    case 'scatter':
      content = (
        <PlotlyChart
          data={[{ x: [1, 2, 3, 4], y: [2, 6, 3, 8], mode: 'markers', type: 'scatter', marker: { color: comp.props.color, size: 12 } }]}
          layout={{ title: comp.props.label, width: comp.props.width, height: comp.props.height }}
        />
      );
      break;
    case 'pie':
      content = (
        <PlotlyChart
          data={[{ values: [19, 26, 55], labels: ['A', 'B', 'C'], type: 'pie', marker: { colors: [comp.props.color, '#F59E42', '#10B981'] } }]}
          layout={{ title: comp.props.label, width: comp.props.width, height: comp.props.height }}
        />
      );
      break;
    case 'dropdown':
      content = (
        <select className="w-full h-full border rounded px-2">
          {comp.props.options.map((opt: string, i: number) => (
            <option key={i}>{opt}</option>
          ))}
        </select>
      );
      break;
    case 'checkbox':
      content = (
        <label className="flex items-center h-full w-full px-2">
          <input type="checkbox" checked={comp.props.checked} readOnly className="mr-2" />
          {comp.props.label}
        </label>
      );
      break;
    case 'text':
      content = (
        <input className="w-full h-full border rounded px-2" placeholder={comp.props.label} value={comp.props.value} readOnly />
      );
      break;
    case 'button':
      content = (
        <button className="w-full h-full rounded text-white font-semibold" style={{ background: comp.props.color }}>{comp.props.label}</button>
      );
      break;
    case 'date':
      content = (
        <input type="date" className="w-full h-full border rounded px-2" />
      );
      break;
    case 'radio':
      content = (
        <div className="flex flex-col px-2">
          {comp.props.options.map((opt: string, i: number) => (
            <label key={i} className="flex items-center">
              <input type="radio" name={comp.id} className="mr-2" />{opt}
            </label>
          ))}
        </div>
      );
      break;
    case 'slider':
      content = (
        <input type="range" min={comp.props.min} max={comp.props.max} value={comp.props.value} readOnly className="w-full" />
      );
      break;
    default:
      content = <div>Unknown</div>;
  }
  return (
    <ResizableBox
      width={comp.props.width}
      height={comp.props.height}
      minConstraints={[100, 40]}
      maxConstraints={[800, 600]}
      onResizeStop={(_e: unknown, data: { size: { width: number; height: number } }) => onChange({ ...comp, props: { ...comp.props, width: data.size.width, height: data.size.height } })}
      className={`border-2 ${isSelected ? 'border-blue-500' : 'border-gray-300'} bg-white shadow-md rounded-lg flex items-center justify-center transition-all duration-150`}
      resizeHandles={['se']}
    >
      <div className="w-full h-full relative">
        {content}
        <button
          className="absolute top-1 right-1 text-xs text-red-500 hover:text-red-700 bg-white rounded px-1"
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onDelete(); }}
        >✕</button>
      </div>
    </ResizableBox>
  );
}

export default function Builder() {
  const [dashboardTitle, setDashboardTitle] = useState('My Dashboard');
  const [components, setComponents] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingType, setDraggingType] = useState<string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [canvasHeight, setCanvasHeight] = useState(700);
  const [search, setSearch] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item: any, monitor) => {
      setDraggingType(null);
      const offset = monitor.getClientOffset();
      if (!offset) return;
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;
      setComponents(prev => [
        ...prev,
        {
          id: uuidv4(),
          type: item.type,
          x: offset.x - canvasRect.left - 100,
          y: offset.y - canvasRect.top - 30,
          props: { ...DEFAULT_PROPS[item.type] },
        },
      ]);
    },
    hover: (item: any, monitor) => {
      setDraggingType(item.type);
    },
    collect: monitor => ({ isOver: monitor.isOver() }),
  }));

  const selected = components.find(c => c.id === selectedId);

  function updateComponent(comp: any) {
    setComponents(comps => comps.map(c => c.id === comp.id ? comp : c));
  }
  function deleteComponent(id: string) {
    setComponents(comps => comps.filter(c => c.id !== id));
    setSelectedId(null);
  }

  // Filtered components for sidebar
  const filteredComponents = COMPONENTS.filter(c => c.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <div className="w-72 bg-white p-4 border-r border-gray-300 shadow-md overflow-y-auto text-black flex flex-col">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Components</h2>
        <input
          type="text"
          placeholder="Search components..."
          className="mb-4 p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex-1 overflow-y-auto">
          {filteredComponents.map(c => (
            <DraggableComponent key={c.type} type={c.type} label={c.label} setDraggingType={setDraggingType} />
          ))}
        </div>
      </div>
      {/* Main Content: Canvas and Properties */}
      <div className="flex flex-1 min-h-0">
        {/* Canvas Area */}
        <div className="flex flex-col flex-1 bg-gray-100 min-h-0">
          <div className="flex items-center justify-between px-8 py-4 border-b bg-white shadow-sm text-black border-gray-300">
            <input
              className="text-2xl font-bold bg-transparent border-b border-gray-400 focus:outline-none focus:border-blue-500 w-1/2 text-black"
              value={dashboardTitle}
              onChange={e => setDashboardTitle(e.target.value)}
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Save</button>
          </div>
          {/* Canvas size controls */}
          <div className="flex gap-4 items-center px-8 py-2 bg-gray-50 border-b border-gray-200">
            <span className="text-sm">Canvas Size:</span>
            <input type="number" className="w-20 border rounded px-2 py-1 text-black" value={canvasWidth} min={400} max={2400} onChange={e => setCanvasWidth(Number(e.target.value))} />
            <span className="text-sm">x</span>
            <input type="number" className="w-20 border rounded px-2 py-1 text-black" value={canvasHeight} min={300} max={1600} onChange={e => setCanvasHeight(Number(e.target.value))} />
          </div>
          <div
            id="sandbox-canvas"
            ref={node => {
              drop(node);
              if (node) {
                (canvasRef as any).current = node;
              }
            }}
            className={`flex-1 relative rounded-lg border-4 border-solid ${isOver ? 'border-blue-400' : 'border-gray-400'} bg-white shadow-lg transition-all duration-200`}
            style={{ minHeight: canvasHeight, width: canvasWidth, maxWidth: '100%', margin: '0 auto', backgroundImage: 'repeating-linear-gradient(0deg, #e5e7eb, #e5e7eb 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #e5e7eb, #e5e7eb 1px, transparent 1px, transparent 20px)' }}
            onClick={() => setSelectedId(null)}
          >
            <div className="absolute left-1/2 top-2 -translate-x-1/2 text-gray-400 text-xs pointer-events-none select-none">Canvas Area</div>
            {/* Ghost box when dragging */}
            {draggingType && isOver && (
              <div className="absolute left-1/2 top-1/2 pointer-events-none z-50" style={{
                width: DEFAULT_PROPS[draggingType].width,
                height: DEFAULT_PROPS[draggingType].height,
                transform: `translate(-50%, -50%)`,
                border: '2px dashed #3B82F6',
                background: 'rgba(59,130,246,0.05)',
                borderRadius: 8,
              }} />
            )}
            {components.map(comp => (
              <Draggable
                key={comp.id}
                bounds="parent"
                position={{ x: comp.x, y: comp.y }}
                onStop={(_e, data) => {
                  setComponents(comps => comps.map(c => c.id === comp.id ? { ...c, x: data.x, y: data.y } : c));
                }}
                handle={'.move-handle-' + comp.id}
              >
                <div
                  style={{ zIndex: selectedId === comp.id ? 10 : 1, position: 'absolute', width: comp.props.width, height: comp.props.height }}
                  onClick={e => { e.stopPropagation(); setSelectedId(comp.id); }}
                >
                  <div className={`move-handle-${comp.id} w-full h-full border-4 rounded-lg flex items-center justify-center transition-all duration-150 bg-white shadow-md ${selectedId === comp.id ? 'border-blue-500' : 'border-gray-700'} hover:border-blue-400`}
                    style={{ boxSizing: 'border-box', textAlign: 'center', cursor: 'move', position: 'relative' }}
                  >
                    <RenderComponent
                      comp={comp}
                      isSelected={selectedId === comp.id}
                      onDelete={() => deleteComponent(comp.id)}
                      onChange={updateComponent}
                    />
                    {/* Custom resize handle in bottom-right */}
                    <div
                      className="absolute right-1 bottom-1 w-4 h-4 bg-gray-300 rounded cursor-se-resize flex items-center justify-center border border-gray-500"
                      style={{ zIndex: 20 }}
                      onMouseDown={e => {
                        e.stopPropagation();
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startWidth = comp.props.width;
                        const startHeight = comp.props.height;
                        function onMouseMove(ev: MouseEvent) {
                          const newWidth = Math.max(100, startWidth + (ev.clientX - startX));
                          const newHeight = Math.max(40, startHeight + (ev.clientY - startY));
                          updateComponent({ ...comp, props: { ...comp.props, width: newWidth, height: newHeight } });
                        }
                        function onMouseUp() {
                          window.removeEventListener('mousemove', onMouseMove);
                          window.removeEventListener('mouseup', onMouseUp);
                        }
                        window.addEventListener('mousemove', onMouseMove);
                        window.addEventListener('mouseup', onMouseUp);
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12"><polyline points="0,12 12,12 12,0" fill="none" stroke="#555" strokeWidth="2"/></svg>
                    </div>
                    {/* Show size overlay, subtle */}
                    <div className="absolute left-1 bottom-1 bg-white/80 text-xs text-gray-500 px-1 rounded border border-gray-200 shadow-sm pointer-events-none" style={{ fontSize: '10px' }}>
                      {comp.props.width} x {comp.props.height}
                    </div>
                    {/* Only show delete X on the component, top-right */}
                    <button
                      className="absolute top-1 right-6 text-xs text-red-500 hover:text-red-700 bg-white rounded px-1 z-30"
                      onClick={e => { e.stopPropagation(); deleteComponent(comp.id); }}
                    >✕</button>
                  </div>
                </div>
              </Draggable>
            ))}
          </div>
        </div>
        {/* Properties Panel */}
        <div className="w-80 bg-white p-4 border-l border-gray-300 shadow-md overflow-y-auto text-black flex flex-col">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Properties</h2>
          {selected ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Label</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
                  value={selected.props.label}
                  onChange={e => updateComponent({ ...selected, props: { ...selected.props, label: e.target.value } })}
                />
              </div>
              {selected.props.color !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <input
                    type="color"
                    className="mt-1 block w-16 h-8 p-0 border-0"
                    value={selected.props.color}
                    onChange={e => updateComponent({ ...selected, props: { ...selected.props, color: e.target.value } })}
                  />
                </div>
              )}
              {selected.type === 'dropdown' || selected.type === 'radio' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Options (comma separated)</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
                    value={selected.props.options.join(', ')}
                    onChange={e => updateComponent({ ...selected, props: { ...selected.props, options: e.target.value.split(',').map((s: string) => s.trim()) } })}
                  />
                </div>
              ) : null}
              {selected.type === 'slider' ? (
                <div className="flex gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
                      value={selected.props.min}
                      onChange={e => updateComponent({ ...selected, props: { ...selected.props, min: Number(e.target.value) } })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
                      value={selected.props.max}
                      onChange={e => updateComponent({ ...selected, props: { ...selected.props, max: Number(e.target.value) } })}
                    />
                  </div>
                </div>
              ) : null}
              <div>
                <label className="block text-sm font-medium text-gray-700">Width</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
                  value={selected.props.width}
                  onChange={e => updateComponent({ ...selected, props: { ...selected.props, width: Number(e.target.value) } })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Height</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
                  value={selected.props.height}
                  onChange={e => updateComponent({ ...selected, props: { ...selected.props, height: Number(e.target.value) } })}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select a component to edit its properties</p>
          )}
        </div>
      </div>
    </div>
  );
} 