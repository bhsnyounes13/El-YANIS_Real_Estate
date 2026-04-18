import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Listings from "@/pages/Listings";
import PropertyDetail from "@/pages/PropertyDetail";

function renderWithLanguageAndRoutes(initialPath: string, routeElement: ReactNode, routePath: string) {
  return render(
    <LanguageProvider>
      <MemoryRouter
        initialEntries={[initialPath]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path={routePath} element={routeElement} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>,
  );
}

describe("routing and page behavior", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
  });

  it("keeps listings query filtering behavior from URL params", () => {
    renderWithLanguageAndRoutes("/listings?q=penthouse", <Listings />, "/listings");

    expect(screen.getByText("Property Listings")).toBeInTheDocument();
    expect(screen.getByText("Penthouse with Sea View")).toBeInTheDocument();
    expect(screen.queryByText("Modern Villa with Garden")).not.toBeInTheDocument();
  });

  it("shows not-found state for unknown property id", () => {
    renderWithLanguageAndRoutes("/property/unknown-id", <PropertyDetail />, "/property/:id");

    expect(screen.getByText("Property not found")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Listings" })).toHaveAttribute("href", "/listings");
  });

  it("shows availability section for rent properties", () => {
    renderWithLanguageAndRoutes("/property/4", <PropertyDetail />, "/property/:id");

    expect(screen.getByText("Check Availability")).toBeInTheDocument();
    expect(screen.getByText("Booked")).toBeInTheDocument();
  });
});
