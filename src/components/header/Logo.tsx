
import React from "react";
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <span className="text-2xl font-bold text-white">
        <span className="text-lavender-400">Se</span>quentia
      </span>
    </Link>
  );
}
