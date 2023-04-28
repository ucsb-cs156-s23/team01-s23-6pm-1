import { render, screen } from "@testing-library/react";
import MovieDetailsPage from "main/pages/Movies/MovieDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: 3,
  }),
  useNavigate: () => mockNavigate,
}));

jest.mock("main/utils/movieUtils", () => {
  return {
    __esModule: true,
    movieUtils: {
      getById: (_id) => {
        return {
          movie: {
            id: 3,
            name: "Titanic",
            synopsis: "Titanic is an epic, action-packed romance set against the ill-fated maiden voyage of the R.M.S. Titanic; the pride and joy of the White Star Line and, at the time, the largest moving object ever built. She was the most luxurious liner of her era -- the ship of dreams -- which ultimately carried over 1,500 people to their death in the ice cold waters of the North Atlantic in the early hours of April 15, 1912.",
            cast: "Leonardo DiCaprio, Kate Winslet, Billy Zane",
          },
        };
      },
    },
  };
});

describe("MovieDetailsPage tests", () => {
  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MovieDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("loads the correct fields, and no buttons", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MovieDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText("Titanic")).toBeInTheDocument();
    expect(screen.getByText("Titanic is an epic, action-packed romance set against the ill-fated maiden voyage of the R.M.S. Titanic; the pride and joy of the White Star Line and, at the time, the largest moving object ever built. She was the most luxurious liner of her era -- the ship of dreams -- which ultimately carried over 1,500 people to their death in the ice cold waters of the North Atlantic in the early hours of April 15, 1912.")).toBeInTheDocument();
    expect(screen.getByText("Leonardo DiCaprio, Kate Winslet, Billy Zane")).toBeInTheDocument();

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
  });
});