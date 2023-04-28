import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
  } from "@testing-library/react";
  import MovieEditPage from "main/pages/Movies/MovieEditPage";
  import { QueryClient, QueryClientProvider } from "react-query";
  import { MemoryRouter } from "react-router-dom";
  import mockConsole from "jest-mock-console";
  
  const mockNavigate = jest.fn();
  
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
      id: 3,
    }),
    useNavigate: () => mockNavigate,
  }));
  
  const mockUpdate = jest.fn();
  jest.mock("main/utils/movieUtils", () => {
    return {
      __esModule: true,
      movieUtils: {
        update: (_movie) => {
          return mockUpdate();
        },
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
  
  describe("MovieEditPage tests", () => {
    const queryClient = new QueryClient();
  
    test("renders without crashing", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MovieEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );
    });
  
    test("loads the correct fields", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MovieEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );
  
      expect(screen.getByTestId("MovieForm-name")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Titanic")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Titanic is an epic, action-packed romance set against the ill-fated maiden voyage of the R.M.S. Titanic; the pride and joy of the White Star Line and, at the time, the largest moving object ever built. She was the most luxurious liner of her era -- the ship of dreams -- which ultimately carried over 1,500 people to their death in the ice cold waters of the North Atlantic in the early hours of April 15, 1912.")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Leonardo DiCaprio, Kate Winslet, Billy Zane")).toBeInTheDocument();
    });
  
    test("redirects to /movies on submit", async () => {
      const restoreConsole = mockConsole();
  
      mockUpdate.mockReturnValue({
        movie: {
          id: 3,
          name: "The Benchwarmers",
          synopsis: "A baseball-loving millionaire (Jon Lovitz) helps three inept nerds (David Spade, Rob Schneider, Jon Heder) form a baseball team to compete with the meanest bullies in the Little League.",
          cast: "David Spade, Rob Schneider, Jon Heder",
        },
      });
  
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MovieEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );
  
      const nameInput = screen.getByLabelText("Name");
      expect(nameInput).toBeInTheDocument();
  
      const synopsisInput = screen.getByLabelText("Synopsis");
      expect(synopsisInput).toBeInTheDocument();
  
      const castInput = screen.getByLabelText("Cast");
      expect(castInput).toBeInTheDocument();
  
      const updateButton = screen.getByText("Update");
      expect(updateButton).toBeInTheDocument();
  
      await act(async () => {
        fireEvent.change(nameInput, {
          target: { value: "Village Inn" },
        });
        fireEvent.change(synopsisInput, {
          target: { value: "1234 Main St" },
        });
        fireEvent.change(castInput, {
          target: { value: "Neat hotel" },
        })
        fireEvent.click(updateButton);
      });
  
      await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/movies"));
  
      // assert - check that the console.log was called with the expected message
      expect(console.log).toHaveBeenCalled();
      const message = console.log.mock.calls[0][0];
      const expectedMessage = `updatedMovie: {"movie":{"id":3,"name":"The Benchwarmers","synopsis":"A baseball-loving millionaire (Jon Lovitz) helps three inept nerds (David Spade, Rob Schneider, Jon Heder) form a baseball team to compete with the meanest bullies in the Little League.","cast":"David Spade, Rob Schneider, Jon Heder"}}`;
  
      expect(message).toMatch(expectedMessage);
      restoreConsole();
    });
  });