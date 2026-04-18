import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ThemeProvider } from "@/theme/ThemeContext";
import Navbar from "@/components/Navbar";

describe("navbar mobile menu", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
  });

  it("toggles mobile navigation links without changing routes", () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <MemoryRouter initialEntries={["/"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Navbar />} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </LanguageProvider>,
    );

    const homeLinksBefore = screen.getAllByRole("link", { name: "Home" });
    expect(homeLinksBefore.length).toBe(1);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    const homeLinksAfterOpen = screen.getAllByRole("link", { name: "Home" });
    expect(homeLinksAfterOpen.length).toBeGreaterThan(1);

    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));

    const homeLinksAfterClose = screen.getAllByRole("link", { name: "Home" });
    expect(homeLinksAfterClose.length).toBe(1);
  });
});
