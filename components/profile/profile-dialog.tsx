"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ProfileDialog({ title, onClose, children }: {
  title: string; onClose: () => void; children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previous;
      requestAnimationFrame(() => { if (opener?.isConnected) opener.focus(); });
    };
  }, []);
  return (
    <dialog ref={ref} className="profile-dialog" aria-labelledby="profile-dialog-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <header className="profile-dialog__heading">
        <div><p>YOUR REQUOTE PROFILE</p><h2 id="profile-dialog-title">{title}</h2></div>
        <button type="button" aria-label="Close dialog" onClick={onClose}>×</button>
      </header>
      {children}
    </dialog>
  );
}
