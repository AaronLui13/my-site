import "./App.css";

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="card">
      <div className="icon">{icon}</div>
      <div className="cardTitle">{title}</div>
      <div className="cardDesc">{desc}</div>
    </div>
  );
}

export default function App() {
  // 之後你部署咗真正 App，改呢條 link 就得
  const APP_URL = "/wheel.html";

  const onStart = () => {
    // 直接喺同一個分頁開啟
    window.location.assign(APP_URL);
  };

  return (
    <div className="page">
      {/* Navbar */}
      <nav className="nav">
        <div className="navInner">
          <div className="brand">
            <span className="brandIcon">🍽️</span>
            <span className="brandText">今日食咩好</span>
          </div>

          <div className="navLinks">
            <a href="#features">功能介紹</a>
            <a href="#scenarios">使用場景</a>
          </div>

          <button className="btnPrimary" onClick={onStart}>
            立即試玩
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="heroGlow" />
        <div className="heroInner">
          <div className="badge">🇭🇰 全港 No.1 美食決策神器</div>

          <h1 className="h1">
            解決你的
            <br />
            <span className="h1Grad">選擇困難症</span>
          </h1>

          <p className="lead">
            唔知食咩好？朋友又講「是但」？
            <br />
            交俾命運轉盤，3 秒鐘幫你決定食咩！
          </p>

          <div className="heroCtas">
            <button className="btnPrimary btnLarge" onClick={onStart}>
              ⚡ 立即開始轉盤
            </button>
            <a className="btnGhost btnLarge" href="#features">
              了解功能
            </a>
          </div>

          <div className="trustRow">
            <div>👥 已有 10,000+ 人使用</div>
            <div>⭐ 100% 免費</div>
            <div>📍 全港適用</div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="section" id="features">
        <div className="sectionInner">
          <h2 className="h2">收錄全港 50+ 熱門美食分類</h2>
          <p className="muted">無論你想搵邊區、邊類菜式，我哋都幫到你</p>

          <div className="grid">
            <FeatureCard icon="🍜" title="日式料理" desc="壽司 / 拉麵 / 丼飯" />
            <FeatureCard icon="🥘" title="港式地道" desc="茶餐廳 / 大排檔" />
            <FeatureCard icon="🌶️" title="辛辣刺激" desc="譚仔 / 酸菜魚 / 泰國菜" />
            <FeatureCard icon="🍔" title="快餐速食" desc="麥當勞 / KFC / 便利店" />
            <FeatureCard icon="🥩" title="鋸扒燒肉" desc="燒肉 / 西餐 / 鐵板燒" />
            <FeatureCard icon="🍲" title="暖胃之選" desc="打邊爐 / 煲仔飯 / 雞煲" />
            <FeatureCard icon="🥟" title="飲茶點心" desc="酒樓 / 點心 / 粥粉麵" />
            <FeatureCard icon="🌏" title="異國風味" desc="越南 / 韓國 / 印度咖喱" />
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section className="section" id="scenarios">
        <div className="sectionInner twoCol">
          <div>
            <h2 className="h2">
              專為 <span className="accent">香港人</span> 設計的生存工具
            </h2>

            <div className="scenario">
              <div className="scenarioIcon">💗</div>
              <div>
                <div className="scenarioTitle">情侶拍拖救星</div>
                <div className="scenarioDesc">
                  唔好再講「是但」啦！用轉盤決定，公平公正，減少嗌交。
                </div>
              </div>
            </div>

            <div className="scenario">
              <div className="scenarioIcon">☕</div>
              <div>
                <div className="scenarioTitle">Office 打工仔必備</div>
                <div className="scenarioDesc">
                  Lunch time 得一個鐘，唔好浪費時間諗食咩，一撳即決。
                </div>
              </div>
            </div>

            <div className="scenario">
              <div className="scenarioIcon">🗺️</div>
              <div>
                <div className="scenarioTitle">一鍵搵附近餐廳</div>
                <div className="scenarioDesc">
                  揀完食咩，再去 Google Maps 搵分店，由決定到出發只需 10 秒。
                </div>
              </div>
            </div>
          </div>

          <div className="mock">
            <div className="mockCard">
              <div className="mockSmall">模擬結果</div>
              <div className="mockBig">譚仔三哥</div>
              <div className="mockMuted">今日食呢個！</div>
              <button className="btnPrimary wFull" onClick={onStart}>
                🔎 搵附近分店
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}

      {/* Footer */}
      <footer className="footer">
        <div className="footerInner">
          <div className="footerBrand">
            <span className="brandIcon">🍽️</span>
            <span className="brandText">香港食咩好</span>
          </div>
          <div className="footerNote">
            © {new Date().getFullYear()} Aaron. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
