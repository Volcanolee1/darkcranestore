export function ShopHero() {
  return (
    <section className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="w-2 h-2 rounded-full bg-[#ff2d78] inline-block shrink-0"
          style={{ boxShadow: "0 0 8px rgba(255,45,120,0.9)" }}
        />
        <span className="font-mono text-xs tracking-[0.2em] text-white/50 uppercase">
          FLEET.CATALOG // SELECT.MODEL
        </span>
      </div>
      <h1 className="font-sans font-extrabold text-4xl md:text-6xl text-white leading-none tracking-tight text-balance">
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
      <p className="mt-4 text-white/50 text-base md:text-lg font-mono max-w-xl leading-relaxed">
        按需选择车型配置，人满即发，全程加密，极速直达目标节点。
      </p>
      <div
        className="mt-8 h-[1px] w-full"
        style={{ background: "linear-gradient(to right, rgba(255,45,120,0.4), rgba(0,230,255,0.2), transparent)" }}
      />
    </section>
  )
}
