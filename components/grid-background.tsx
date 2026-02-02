export function GridBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Grid layer */}
      <div className="grid-pattern absolute inset-0" />
      {/* Radial gradient mask layer */}
      <div className="radial-mask absolute inset-0" />
    </div>
  );
}
