import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Listings from "@/pages/Listings";
import PropertyDetail from "@/pages/PropertyDetail";
import { TestProviders } from "@/test/test-utils";

function renderWithLanguageAndRoutes(
  initialPath: string,
  routeElement: ReactNode,
  routePath: string,
) {
  return render(
    <TestProviders>
      <LanguageProvider>
        <MemoryRouter
          initialEntries={[initialPath]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route path={routePath} element={routeElement} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    </TestProviders>,
  );
}

describe("routing and page behavior", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
  });

  it("keeps listings query filtering behavior from URL params", async () => {
    renderWithLanguageAndRoutes("/listings?q=penthouse", <Listings />, "/listings");

    await waitFor(() => {
      expect(screen.getByText("Property Listings")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Penthouse with Sea View/)).toBeInTheDocument();
    });
    expect(screen.queryByText("Modern Villa with Garden")).not.toBeInTheDocument();
  });

  it("shows not-found state for unknown property id", async () => {
    renderWithLanguageAndRoutes("/property/unknown-id", <PropertyDetail />, "/property/:id");

    await waitFor(() => {
      expect(screen.getByText("Property not found")).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: "Back to Listings" })).toHaveAttribute(
      "href",
      "/listings",
    );
  });

  it("shows availability section for rent properties", async () => {
    renderWithLanguageAndRoutes("/property/4", <PropertyDetail />, "/property/:id");

    await waitFor(() => {
      expect(screen.getByText("Availability")).toBeInTheDocument();
    });
  });
});
