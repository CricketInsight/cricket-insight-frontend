"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Inning } from "@/lib/api/matches"


interface CricketBallPopupProps {
  isOpen: boolean
  onClose: () => void
  ballData: Inning | null
}

export default function CricketBallPopup({ isOpen, onClose, ballData }: CricketBallPopupProps) {
  const [animationPhase, setAnimationPhase] = useState<"idle" | "bowling" | "batting" | "result">("idle")

  useEffect(() => {
    if (isOpen && ballData) {
      // Reset and start animation sequence
      setAnimationPhase("idle")
      const timer1 = setTimeout(() => setAnimationPhase("bowling"), 200)
      const timer2 = setTimeout(() => setAnimationPhase("batting"), 1200)
      const timer3 = setTimeout(() => setAnimationPhase("result"), 2000)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [isOpen, ballData])

  if (!isOpen || !ballData) return null

  const getEventType = () => {
    if (ballData.outcome === "Wicket" || ballData.dismissal) return "WICKET"
    if (ballData.runs_on_ball === 6) return "SIX"
    if (ballData.runs_on_ball === 4) return "FOUR"
    if (ballData.runs_on_ball === 0) return "DOT"
    return "RUNS"
  }

  const eventType = getEventType()

  const getEventColor = () => {
    switch (eventType) {
      case "SIX":
        return "text-purple-600"
      case "FOUR":
        return "text-green-600"
      case "WICKET":
        return "text-red-600"
      case "DOT":
        return "text-gray-600"
      default:
        return "text-blue-600"
    }
  }

  const getEventDescription = () => {
    switch (eventType) {
      case "SIX":
        return "Maximum! Six runs!"
      case "FOUR":
        return "Boundary! Four runs!"
      case "WICKET":
        return "Wicket! Batsman dismissed!"
      case "DOT":
        return "Dot ball - No runs"
      default:
        return `${ballData.runs_on_ball} run${ballData.runs_on_ball !== 1 ? "s" : ""}`
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Ball info header */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">
            Over {ballData.over}.{ballData.ball}
          </h3>
          <p className="text-sm text-gray-600">
            {ballData.bowler_name} to {ballData.batsman_name}
          </p>
          {ballData.commentary && (
            <div 
              className="text-xs text-gray-500 mt-1 italic"
              dangerouslySetInnerHTML={{
                __html: `"${ballData.commentary}"`
              }}
            />
          )}
        </div>

        {/* Animation area */}
        <div className="relative h-48 bg-green-100 rounded-lg mb-6 overflow-hidden">
          {/* Cricket pitch */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-200 to-green-300">
            {/* Pitch lines */}
            <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-white opacity-50"></div>
            <div className="absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-white opacity-30"></div>
          </div>

          {/* Stumps (bowler end) */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
            <div className="flex space-x-0.5">
              <div className="w-1 h-8 bg-yellow-600 rounded-t"></div>
              <div className="w-1 h-8 bg-yellow-600 rounded-t"></div>
              <div className="w-1 h-8 bg-yellow-600 rounded-t"></div>
            </div>
            {eventType === "WICKET" && animationPhase === "result" && (
              <div className="absolute inset-0 animate-pulse">
                <div className="flex space-x-0.5 animate-bounce">
                  <div className="w-1 h-4 bg-yellow-600 rounded-t transform rotate-12"></div>
                  <div className="w-1 h-4 bg-yellow-600 rounded-t transform -rotate-12"></div>
                  <div className="w-1 h-4 bg-yellow-600 rounded-t transform rotate-6"></div>
                </div>
              </div>
            )}
          </div>

          {/* Stumps (batsman end) */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="flex space-x-0.5">
              <div className="w-1 h-8 bg-yellow-600 rounded-t"></div>
              <div className="w-1 h-8 bg-yellow-600 rounded-t"></div>
              <div className="w-1 h-8 bg-yellow-600 rounded-t"></div>
            </div>
          </div>

          {/* Bowler */}
          <div
            className={`absolute left-12 top-1/2 transform -translate-y-1/2 transition-all duration-1000 ${
              animationPhase === "bowling" ? "animate-pulse scale-110" : ""
            }`}
          >
            <div className="relative">
              {/* Head */}
              <div className="w-8 h-8 bg-blue-500 rounded-full mb-1 mx-auto shadow-md"></div>
              {/* Body */}
              <div className="w-6 h-12 bg-blue-400 rounded-lg mx-auto relative">
                {/* Arms - animated during bowling */}
                <div
                  className={`absolute -left-2 top-2 w-4 h-1.5 bg-blue-300 rounded-full transition-transform duration-500 ${
                    animationPhase === "bowling" ? "rotate-45 -translate-y-1" : "rotate-12"
                  }`}
                ></div>
                <div
                  className={`absolute -right-2 top-2 w-4 h-1.5 bg-blue-300 rounded-full transition-transform duration-500 ${
                    animationPhase === "bowling" ? "-rotate-45 translate-y-1" : "-rotate-12"
                  }`}
                ></div>
              </div>
              {/* Legs */}
              <div className="flex justify-center space-x-1 mt-1">
                <div
                  className={`w-1.5 h-6 bg-blue-400 rounded transition-transform duration-500 ${
                    animationPhase === "bowling" ? "rotate-12" : ""
                  }`}
                ></div>
                <div
                  className={`w-1.5 h-6 bg-blue-400 rounded transition-transform duration-500 ${
                    animationPhase === "bowling" ? "-rotate-12" : ""
                  }`}
                ></div>
              </div>
              {/* Bowling action effect */}
              {animationPhase === "bowling" && (
                <div className="absolute -right-4 top-4 w-2 h-2 bg-blue-200 rounded-full animate-ping opacity-75"></div>
              )}
            </div>
          </div>

          {/* Batsman */}
          <div
            className={`absolute right-16 top-1/2 transform -translate-y-1/2 transition-all duration-1000 ${
              animationPhase === "batting" ? (eventType === "WICKET" ? "animate-bounce" : "scale-110") : ""
            }`}
          >
            <div className="relative">
              {/* Head */}
              <div className="w-8 h-8 bg-red-500 rounded-full mb-1 mx-auto shadow-md"></div>
              {/* Body */}
              <div className="w-6 h-12 bg-red-400 rounded-lg mx-auto relative">
                {/* Arms - animated during batting */}
                <div
                  className={`absolute -left-1 top-3 w-3 h-1.5 bg-red-300 rounded-full transition-transform duration-300 ${
                    animationPhase === "batting" && eventType !== "WICKET" ? "rotate-45" : "rotate-12"
                  }`}
                ></div>
                <div
                  className={`absolute -right-1 top-3 w-3 h-1.5 bg-red-300 rounded-full transition-transform duration-300 ${
                    animationPhase === "batting" && eventType !== "WICKET" ? "-rotate-45" : "-rotate-12"
                  }`}
                ></div>
              </div>
              {/* Legs - batting stance */}
              <div className="flex justify-center space-x-2 mt-1">
                <div
                  className={`w-1.5 h-6 bg-red-400 rounded transition-transform duration-300 ${
                    animationPhase === "batting" ? "rotate-6" : ""
                  }`}
                ></div>
                <div
                  className={`w-1.5 h-6 bg-red-400 rounded transition-transform duration-300 ${
                    animationPhase === "batting" ? "-rotate-6" : ""
                  }`}
                ></div>
              </div>
              {/* Bat - enhanced with better positioning */}
              <div
                className={`absolute -right-2 top-8 w-8 h-1.5 bg-yellow-700 rounded-full shadow-sm transition-all duration-500 origin-left ${
                  animationPhase === "batting" && eventType !== "WICKET"
                    ? eventType === "SIX"
                      ? "rotate-75 -translate-y-2"
                      : "rotate-45 -translate-y-1"
                    : eventType === "WICKET" && animationPhase === "batting"
                      ? "rotate-12 opacity-50"
                      : "rotate-12"
                }`}
              >
                {/* Bat handle */}
                <div className="absolute right-0 top-0 w-2 h-1.5 bg-yellow-800 rounded-full"></div>
              </div>
              {/* Batting impact effect */}
              {animationPhase === "batting" && eventType !== "WICKET" && eventType !== "DOT" && (
                <div className="absolute -right-1 top-8 w-3 h-3 bg-yellow-200 rounded-full animate-ping opacity-75"></div>
              )}
            </div>
          </div>

          {/* Ball */}
          <div
            className={`absolute w-3 h-3 bg-red-600 rounded-full shadow-lg transition-all duration-1000 ${
              animationPhase === "idle"
                ? "left-10 top-1/2 transform -translate-y-1/2"
                : animationPhase === "bowling"
                  ? "left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin"
                  : animationPhase === "batting"
                    ? "right-14 top-1/2 transform -translate-y-1/2"
                    : eventType === "SIX"
                      ? "right-4 top-4 animate-bounce scale-125"
                      : eventType === "FOUR"
                        ? "right-4 top-1/3 scale-110"
                        : eventType === "WICKET"
                          ? "right-8 top-1/2 transform -translate-y-1/2 opacity-50"
                          : "right-12 top-1/2 transform -translate-y-1/2"
            }`}
          >
            <div className="absolute inset-0 border border-white opacity-50 rounded-full"></div>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white opacity-30 transform -translate-y-1/2"></div>
          </div>

          {/* Ball trail for SIX */}
          {eventType === "SIX" && animationPhase === "result" && (
            <div className="absolute right-8 top-8 animate-ping">
              <div className="w-1 h-1 bg-red-400 rounded-full opacity-75"></div>
            </div>
          )}

          {/* Boundary rope for FOUR */}
          {eventType === "FOUR" && animationPhase === "result" && (
            <div className="absolute right-2 top-0 bottom-0 w-1 bg-white animate-pulse"></div>
          )}
        </div>

        {/* Result display */}
        <div className="text-center">
          <div className={`text-2xl font-bold mb-2 ${getEventColor()}`}>
            {ballData.runs_on_ball} {ballData.runs_on_ball === 1 ? "Run" : "Runs"}
          </div>
          <div className={`text-lg font-semibold mb-2 ${getEventColor()}`}>{getEventDescription()}</div>
          {ballData.shot_type && <div className="text-sm text-gray-600">Shot: {ballData.shot_type}</div>}
          {ballData.dismissal && (
            <div className="text-sm text-red-600 font-medium">Dismissal: {ballData.dismissal}</div>
          )}
          <div className="text-xs text-gray-500 mt-2">
            {ballData.current_batting_team} vs {ballData.current_bowling_team}
          </div>
        </div>
      </div>
    </div>
  )
}
