import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import MovieCreatePage from "main/pages/Movies/MovieCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/movieUtils', () => {
    return {
        __esModule: true,
        movieUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("MovieCreatePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /movies on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "movie": {
                id: 3,
                name: "South Coast Deli",
                synopsis: "Sandwiches and Salads",
                cast: "lol"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();


        const synopsisInput = screen.getByLabelText("Synopsis");
        expect(synopsisInput).toBeInTheDocument();

        const castInput = screen.getByLabelText("Cast");
        expect(castInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'South Coast Deli' } })
            fireEvent.change(synopsisInput, { target: { value: 'Sandwiches and Salads' } })
            fireEvent.change(castInput, { target: { value: 'lol' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/movies"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdMovie: {"movie":{"id":3,"name":"South Coast Deli","synopsis":"Sandwiches and Salads","cast":"lol"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


