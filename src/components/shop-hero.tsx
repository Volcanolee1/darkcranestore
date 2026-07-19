export function ShopHero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-12 pt-32">
      <div className="mb-4 flex items-center gap-3">
        <span
          className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#ff2d78]"
          style={{ boxShadow: "0 0 8px rgba(255,45,120,0.9)" }}
        />
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
          FLEET.CATALOG // SELECT.MODEL
        </span>
      </div>
      <h1 className="text-balance font-sans text-4xl font-extrabold leading-none tracking-tight text-white md:text-6xl">
        车型
        <span
          className="ml-4"
          style={{
            color: "#ff2d78",
            textShadow: "0 0 20px rgba(255,45,120,0.7), 0 0 50px rgba(255,45,120,0.3)",
          }}
        >
          选购
        </span>
      </h1>
      <p className="mt-4 max-w-xl font-mono text-base leading-relaxed text-white/50 md:text-lg">
        按需选择车型配置，人满即发，全程加密，极速直达目标节点。
      </p>
      <div
        className="mt-8 h-px w-full"
        style={{ background: "linear-gradient(to right, rgba(255,45,120,0.4), rgba(0,230,255,0.2), transparent)" }}
      />
    </section>
  )
}
