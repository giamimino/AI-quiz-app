SELECT 
  COUNT(*) AS game_played,
  COUNT(*) FILTER (WHERE "isWinner" = TRUE) AS wins,
  COUNT(*) FILTER (WHERE "isWinner" = FALSE) AS losses
FROM "GamePlayers"
WHERE "userId" = $1;
