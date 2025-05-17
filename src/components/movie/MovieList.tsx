import React from "react";
import MovieCard from "./MovieCard";
import type { Movie } from "../../api/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";

interface MovieListProps {
  title: string;
  movies: Movie[];
  layout?: "grid" | "scroll";
  limit?: number;
  viewAllLink?: string;
}

const MovieList: React.FC<MovieListProps> = ({
  title,
  movies,
  layout = "grid",
  limit,
}) => {
  const displayedMovies = limit ? movies.slice(0, limit) : movies;

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title text-white text-2xl font-bold">{title}</h2>
      </div>

      {layout === "scroll" ? (
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex space-x-4 pb-4">
            {displayedMovies.map((movie) => (
              <div
                key={movie.id}
                className="min-w-[180px] w-[180px] transition-transform duration-300"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="mt-1 h-2" />
        </ScrollArea>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {displayedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;
