import { render, screen, waitFor } from "@testing-library/react";
import MovieIndexPage from "main/pages/Movies/MovieIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockDelete = jest.fn();
jest.mock('main/utils/movieUtils', () => {
    return {
        __esModule: true,
        movieUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    movies: [
                        {
                            id: 3,
                            name: "Titanic",
                            synopsis: "Titanic is an epic, action-packed romance set against the ill-fated maiden voyage of the R.M.S. Titanic; the pride and joy of the White Star Line and, at the time, the largest moving object ever built. She was the most luxurious liner of her era -- the ship of dreams -- which ultimately carried over 1,500 people to their death in the ice cold waters of the North Atlantic in the early hours of April 15, 1912.",
                            cast: "Leonardo DiCaprio, Kate Winslet, Billy Zane",  
                        },
                    ]
                }
            }
        }
    }
});


describe("MovieIndexPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createMovieButton = screen.getByText("Create Movie");
        expect(createMovieButton).toBeInTheDocument();
        expect(createMovieButton).toHaveAttribute("style", "float: right;");

        const name = screen.getByText("Titanic");
        expect(name).toBeInTheDocument();

        const synopsis = screen.getByText("Titanic is an epic, action-packed romance set against the ill-fated maiden voyage of the R.M.S. Titanic; the pride and joy of the White Star Line and, at the time, the largest moving object ever built. She was the most luxurious liner of her era -- the ship of dreams -- which ultimately carried over 1,500 people to their death in the ice cold waters of the North Atlantic in the early hours of April 15, 1912.");
        expect(synopsis).toBeInTheDocument();
        
        const cast = screen.getByText("Leonardo DiCaprio, Kate Winslet, Billy Zane");
        expect(cast).toBeInTheDocument();

        expect(screen.getByTestId("MovieTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("MovieTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("MovieTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const name = screen.getByText("Titanic");
        expect(name).toBeInTheDocument();

        const synopsis = screen.getByText("Titanic is an epic, action-packed romance set against the ill-fated maiden voyage of the R.M.S. Titanic; the pride and joy of the White Star Line and, at the time, the largest moving object ever built. She was the most luxurious liner of her era -- the ship of dreams -- which ultimately carried over 1,500 people to their death in the ice cold waters of the North Atlantic in the early hours of April 15, 1912.");
        expect(synopsis).toBeInTheDocument();

        const cast = screen.getByText("Leonardo DiCaprio, Kate Winslet, Billy Zane");
        expect(cast).toBeInTheDocument();

        const deleteButton = screen.getByTestId("MovieTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/movies"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `MovieIndexPage deleteCallback: {"id":3,"name":"Titanic","synopsis":"Titanic is an epic, action-packed romance set against the ill-fated maiden voyage of the R.M.S. Titanic; the pride and joy of the White Star Line and, at the time, the largest moving object ever built. She was the most luxurious liner of her era -- the ship of dreams -- which ultimately carried over 1,500 people to their death in the ice cold waters of the North Atlantic in the early hours of April 15, 1912.","cast":"Leonardo DiCaprio, Kate Winslet, Billy Zane"}`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});