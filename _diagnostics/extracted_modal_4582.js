/* Assistant Modal (Unblurred background as requested & fully screen-fitted) */
.assistant-modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(8, 1, 20, 0.45);
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  z-index: 100000;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 1rem;
  overflow-y: auto;
  box-sizing: border-box;
}

.assistant-modal-overlay.active {
  display: flex;
}

.assistant-modal-card {
  position: relative;
  background: rgba(18, 5, 42, 0.98);
  border-radius: 24px 8px 24px 8px;
  border: 1.5px solid rgba(0, 229, 212, 0.75);
  outline: 1.5px solid rgba(255, 215, 0, 0.55);
  outline-offset: 4px;
  box-shadow: 0 25px 85px rgba(0, 0, 0, 0.95), 0 0 45px rgba(0, 229, 212, 0.35);
  padding: 1.6rem 1.8rem 1.4rem;
  max-width: 480px;
  width: 100%;
  max-height: calc(100vh - 2.5rem);
  max-height: calc(100dvh - 2.5rem);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 229, 212, 0.5) rgba(10, 2, 25, 0.4);
  box-sizing: border-box;
  margin: auto;
}

.assistant-modal-header {
  text-align: center;
  margin-bottom: 0.9rem;
}

.assistant-modal-icon-orb {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #FFD700;
  box-shadow: 0 0 18px rgba(0, 229, 212, 0.65), 0 0 25px rgba(157, 78, 221, 0.5);
  margin: 0 auto 0.45rem;
}

.assistant-modal-eye-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.assistant-modal-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.35rem;
  filter: drop-shadow(0 0 10px #00E5D4);
}

.assistant-modal-header h3 {
  font-family: var(--font-sans);
  font-size: 1.35rem;
  font-weight: 900;
  color: #FFFFFF;
  margin-bottom: 0.2rem;
  line-height: 1.2;
}

.assistant-modal-header p {
  color: var(--tiffany-pale);
  font-size: 0.88rem;
  margin: 0;
}

.assistant-quick-links {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* aEye Search Bar */
.aeye-search-wrap {
  position: relative;
  margin-bottom: 0.65rem;
}

.aeye-search-input {
  width: 100%;
  padding: 0.65rem 1rem 0.65rem 2.5rem;
  border-radius: 14px;
  border: 1.5px solid rgba(199, 125, 255, 0.35);
  background: rgba(255, 255, 255, 0.06);
  color: #FFFFFF;
  font-family: var(--font-sans);
  font-size: 0.86rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  box-sizing: border-box;
}

.aeye-search-input::placeholder {
  color: rgba(163, 255, 248, 0.55);
  font-variant: all-small-caps;
}

.aeye-search-input:focus {
  border-color: var(--tiffany);
  box-shadow: 0 0 18px rgba(0, 229, 212, 0.35);
}

.aeye-search-icon {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.95rem;
  color: var(--tiffany-pale);
  pointer-events: none;
}

.aeye-brand-label {
  display: block;
  text-align: center;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(199, 125, 255, 0.65);
  margin-top: 0.65rem;
}

.assistant-link-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 1.1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(199, 125, 255, 0.3);
  border-radius: 14px 4px 14px 4px;
  color: #FFFFFF;
  text-decoration: none;
  transition: all 0.25s ease;
  box-sizing: border-box;
}

.assistant-link-card:hover {
  background: rgba(0, 229, 212, 0.18);
  border-color: #00FFC8;
  transform: translateX(4px);
  box-shadow: 0 0 20px rgba(0, 229, 212, 0.35);
}

.assistant-link-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}

.assistant-link-card strong {
  display: block;
  font-family: var(--font-sans);
  font-size: 0.90rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 0.1rem;
}

.assistant-link-card span {
  font-size: 0.76rem;
  color: var(--tiffany-pale);
  line-height: 1.3;
}

.assistant-link-arrow {
  margin-left: auto;
  font-size: 1.1rem;
  color: #00FFC8;
  font-weight: 900;
}

@media (max-height: 740px), (max-width: 480px) {
  .assistant-modal-card {
    padding: 1.2rem 1.3rem 1.1rem;
    max-height: calc(100vh - 1.5rem);
    max-height: calc(100dvh - 1.5rem);
  }
  .assistant-modal-icon-orb {
    width: 38px;
    height: 38px;
    margin-bottom: 0.3rem;
  }
  .assistant-modal-header {
    margin-bottom: 0.65rem;
  }
  .assistant-modal-header h3 {
    font-size: 1.18rem;
  }
  .assistant-quick-links {
    gap: 0.45rem;
  }
  .assistant-link-card {
    padding: 0.55rem 0.9rem;
  }
}