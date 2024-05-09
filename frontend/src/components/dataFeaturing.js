import React, { useEffect, useState }  from 'react';
import * as d3 from 'd3'; // Import the d3 library
import playerData from "./player_data.csv";

async function dataExtraction(){
  try{ 
      const data = await d3.csv(playerData)
      console.log("Column Data: ", data);
      let sumGoalsPremierLeague = 0; let sumGoalsSerieA = 0; let sumGoalsLaLiga = 0; let sumGoalsBundesliga = 0; let sumGoalsLigue1 = 0;

      let sumAgeLaLiga = 0; let sumAgeSerieA = 0; let sumAgePremierLeague = 0; let sumAgeBundesliga = 0; let sumAgeLigue1 = 0;
      let sumPlayerCountLaLiga = 0; let sumPlayerCountSerieA = 0; let sumPlayerCountPremierLeague = 0; let sumPlayerCountBundesliga = 0; let sumPlayerCountLigue1 = 0;
      let sumPassesLaLiga = 0; let sumPassesSerieA = 0; let sumPassesPremierLeague = 0; let sumPassesBundesliga = 0; let sumPassesLigue1 = 0;
      let sumFoulsLaLiga = 0; let sumFoulsSerieA = 0; let sumFoulsPremierLeague = 0; let sumFoulsBundesliga = 0; let sumFoulsLigue1 = 0;

      let TeamsPremierLeague = {};
      let TeamsLigue1 = {};
      let TeamsBundesliga = {};
      let TeamsSerieA = {};
      let TeamsLaLiga = {};

      let LaLigaBin = {"0-20":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "21-25":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "26-30":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "31-35":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "35-40":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "40+":{goals:0, playerCount:0, sucPass:0, fouls:0}}

      let SerieABin = {"0-20":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "21-25":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "26-30":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "31-35":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "35-40":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "40+":{goals:0, playerCount:0, sucPass:0, fouls:0}};

      let BundesligaBin = {"0-20":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "21-25":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "26-30":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "31-35":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "35-40":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "40+":{goals:0, playerCount:0, sucPass:0, fouls:0}};

      let Ligue1Bin = {"0-20":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "21-25":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "26-30":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "31-35":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "35-40":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "40+":{goals:0, playerCount:0, sucPass:0, fouls:0}};

      let PremierLeagueBin = {"0-20":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "21-25":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "26-30":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "31-35":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "35-40":{goals:0, playerCount:0, sucPass:0, fouls:0},
      "40+":{goals:0, playerCount:0, sucPass:0, fouls:0}};

      let agegrp;
      console.log("data length: ", data.length)
      for (let i = 0; i < data.length; i++) {
          // Check if the competition is "La Liga"

          if (data[i].Age < 20) {
            agegrp = "0-20";
          } else if (data[i].Age >= 21 && data[i].Age <= 25) {
            agegrp = "21-25";
          } else if (data[i].Age >= 26 && data[i].Age <= 30) {
            agegrp = "26-30";
          } else if (data[i].Age >= 31 && data[i].Age <= 35) {
            agegrp = "31-35";
          } else if (data[i].Age >= 36 && data[i].Age <= 40) {
            agegrp = "35-40";
          } else if (data[i].Age >= 41) {
            agegrp = "40+";
          }

          if (data[i].Comp === "La Liga") {
              // Sum up the GoalsScored
              sumGoalsLaLiga += parseInt(data[i].GoalsScored);
              sumAgeLaLiga += parseFloat(data[i].Age);
              sumPlayerCountLaLiga++;
              sumPassesLaLiga +=parseInt(data[i].TotalSuccessPasses);
              sumFoulsLaLiga +=parseInt(data[i].FoulsCommitted);
              
              // Update total goals for the team in TeamsLaLiga dictionary
              if (!(data[i].Squad in TeamsLaLiga)) {
                  TeamsLaLiga[data[i].Squad] = { goals: 0, totalAge: 0, playerCount: 0, avgAge : 0, sucPass : 0, fouls : 0};
              }
              TeamsLaLiga[data[i].Squad].goals += parseInt(data[i].GoalsScored);
              TeamsLaLiga[data[i].Squad].totalAge += parseFloat(data[i].Age);
              TeamsLaLiga[data[i].Squad].playerCount++;
              TeamsLaLiga[data[i].Squad].avgAge = TeamsLaLiga[data[i].Squad].totalAge / TeamsLaLiga[data[i].Squad].playerCount;
              TeamsLaLiga[data[i].Squad].sucPass += parseInt(data[i].TotalSuccessPasses);
              TeamsLaLiga[data[i].Squad].fouls += parseInt(data[i].FoulsCommitted);

              LaLigaBin[agegrp].playerCount++;
              LaLigaBin[agegrp].goals += parseInt(data[i].GoalsScored);
              LaLigaBin[agegrp].sucPass += parseInt(data[i].TotalSuccessPasses);
              LaLigaBin[agegrp].fouls += parseInt(data[i].FoulsCommitted);
            
          }
          // Repeat the same pattern for other leagues
          else if (data[i].Comp === "Premier League") {
              sumGoalsPremierLeague += parseInt(data[i].GoalsScored);
              sumAgePremierLeague += parseFloat(data[i].Age);
              sumPlayerCountPremierLeague++;
              sumPassesPremierLeague +=parseInt(data[i].TotalSuccessPasses);
              sumFoulsPremierLeague += parseInt(data[i].FoulsCommitted);
              if (!(data[i].Squad in TeamsPremierLeague)) {
                  TeamsPremierLeague[data[i].Squad] = { goals: 0, totalAge: 0, playerCount: 0, avgAge : 0, sucPass : 0, fouls : 0};
              }
              TeamsPremierLeague[data[i].Squad].goals += parseInt(data[i].GoalsScored);
              TeamsPremierLeague[data[i].Squad].totalAge += parseFloat(data[i].Age);
              TeamsPremierLeague[data[i].Squad].playerCount++;
              TeamsPremierLeague[data[i].Squad].avgAge = TeamsPremierLeague[data[i].Squad].totalAge / TeamsPremierLeague[data[i].Squad].playerCount;
              TeamsPremierLeague[data[i].Squad].sucPass += parseInt(data[i].TotalSuccessPasses);
              TeamsPremierLeague[data[i].Squad].fouls += parseInt(data[i].FoulsCommitted);

              PremierLeagueBin[agegrp].playerCount++;
              PremierLeagueBin[agegrp].goals += parseInt(data[i].GoalsScored);
              PremierLeagueBin[agegrp].sucPass += parseInt(data[i].TotalSuccessPasses);
              PremierLeagueBin[agegrp].fouls += parseInt(data[i].FoulsCommitted);

          } 
          else if (data[i].Comp === "Ligue 1") {
              sumGoalsLigue1 += parseInt(data[i].GoalsScored);
              sumAgeLigue1 += parseFloat(data[i].Age);
              sumPlayerCountLigue1++;
              sumPassesLigue1 +=parseInt(data[i].TotalSuccessPasses);
              sumFoulsLigue1 += parseInt(data[i].FoulsCommitted);
              if (!(data[i].Squad in TeamsLigue1)) {
                  TeamsLigue1[data[i].Squad] = { goals: 0, totalAge: 0, playerCount: 0, avgAge : 0, sucPass : 0, fouls : 0};
              }
              TeamsLigue1[data[i].Squad].goals += parseInt(data[i].GoalsScored);
              TeamsLigue1[data[i].Squad].totalAge += parseFloat(data[i].Age);
              TeamsLigue1[data[i].Squad].playerCount++;
              TeamsLigue1[data[i].Squad].avgAge = TeamsLigue1[data[i].Squad].totalAge / TeamsLigue1[data[i].Squad].playerCount;
              TeamsLigue1[data[i].Squad].sucPass += parseInt(data[i].TotalSuccessPasses);
              TeamsLigue1[data[i].Squad].fouls += parseInt(data[i].FoulsCommitted);

              Ligue1Bin[agegrp].playerCount++;
              Ligue1Bin[agegrp].goals += parseInt(data[i].GoalsScored);
              Ligue1Bin[agegrp].sucPass += parseInt(data[i].TotalSuccessPasses);
              Ligue1Bin[agegrp].fouls += parseInt(data[i].FoulsCommitted);
              
          } 
          else if (data[i].Comp === "Bundesliga") {
              sumGoalsBundesliga += parseInt(data[i].GoalsScored);
              sumAgeBundesliga += parseFloat(data[i].Age);
              sumPlayerCountBundesliga++;
              sumPassesBundesliga += parseInt(data[i].TotalSuccessPasses);
              sumFoulsBundesliga += parseInt(data[i].FoulsCommitted);

              if (!(data[i].Squad in TeamsBundesliga)) {
                  TeamsBundesliga[data[i].Squad] = { goals: 0, totalAge: 0, playerCount: 0, avgAge : 0, sucPass : 0, fouls : 0};
              }
              TeamsBundesliga[data[i].Squad].goals += parseInt(data[i].GoalsScored);
              TeamsBundesliga[data[i].Squad].totalAge += parseFloat(data[i].Age);
              TeamsBundesliga[data[i].Squad].playerCount++;
              TeamsBundesliga[data[i].Squad].avgAge = TeamsBundesliga[data[i].Squad].totalAge / TeamsBundesliga[data[i].Squad].playerCount;
              TeamsBundesliga[data[i].Squad].sucPass += parseInt(data[i].TotalSuccessPasses);
              TeamsBundesliga[data[i].Squad].fouls += parseInt(data[i].FoulsCommitted);

              BundesligaBin[agegrp].playerCount++;
              BundesligaBin[agegrp].goals += parseInt(data[i].GoalsScored);
              BundesligaBin[agegrp].sucPass += parseInt(data[i].TotalSuccessPasses);
              BundesligaBin[agegrp].fouls += parseInt(data[i].FoulsCommitted);
              
          } 
          else if (data[i].Comp === "Serie A") {
              sumGoalsSerieA += parseInt(data[i].GoalsScored);
              sumAgeSerieA += parseFloat(data[i].Age);
              sumPlayerCountSerieA++;
              sumPassesSerieA +=parseInt(data[i].TotalSuccessPasses);
              sumFoulsSerieA += parseInt(data[i].FoulsCommitted);
              if (!(data[i].Squad in TeamsSerieA)) {
                  TeamsSerieA[data[i].Squad] = { goals: 0, totalAge: 0, playerCount: 0, avgAge : 0, sucPass : 0, fouls : 0};
              }
              TeamsSerieA[data[i].Squad].goals += parseInt(data[i].GoalsScored);
              TeamsSerieA[data[i].Squad].totalAge += parseFloat(data[i].Age);
              TeamsSerieA[data[i].Squad].playerCount++;
              TeamsSerieA[data[i].Squad].avgAge = TeamsSerieA[data[i].Squad].totalAge / TeamsSerieA[data[i].Squad].playerCount;
              TeamsSerieA[data[i].Squad].sucPass += parseInt(data[i].TotalSuccessPasses);
              TeamsSerieA[data[i].Squad].fouls += parseInt(data[i].FoulsCommitted);

              SerieABin[agegrp].playerCount++;
              SerieABin[agegrp].goals += parseInt(data[i].GoalsScored);
              SerieABin[agegrp].sucPass += parseInt(data[i].TotalSuccessPasses);
              SerieABin[agegrp].fouls += parseInt(data[i].FoulsCommitted);

          }
      }

      // console.log(LaLigaBin);
      // console.log(Ligue1Bin);
      // console.log(PremierLeagueBin);
      // console.log(BundesligaBin);
      // console.log(SerieABin);
      

      // console.log("Sum of goals in La Liga: ", sumGoalsLaLiga);
      // console.log("Sum of goals in Premier League: ", sumGoalsPremierLeague);
      // console.log("Sum of goals in Serie A: ", sumGoalsSerieA);
      // console.log("Sum of goals in Bundesliga: ", sumGoalsBundesliga);
      // console.log("Sum of goals in Ligue 1: ", sumGoalsLigue1);

      
      let totalGoals = [sumGoalsPremierLeague, sumGoalsLigue1, sumGoalsBundesliga, sumGoalsSerieA, sumGoalsLaLiga];
      let LeagueAvgAge = [sumAgePremierLeague/sumPlayerCountPremierLeague, sumAgeLigue1/sumPlayerCountLigue1, sumAgeBundesliga/sumPlayerCountBundesliga, sumAgeSerieA/sumPlayerCountSerieA, sumAgeLaLiga/sumPlayerCountLaLiga]
      let LeaguePasses = [sumPassesPremierLeague, sumPassesLigue1, sumPassesBundesliga, sumPassesSerieA, sumPassesLaLiga];
      let LeagueFouls = [sumFoulsPremierLeague, sumFoulsLigue1, sumFoulsBundesliga, sumFoulsSerieA, sumFoulsLaLiga];
      let leagues = ["Premier League", "Ligue 1", "Bundesliga", "Serie A", "La Liga"]
      let allTeamsStats = [{"Premier League":TeamsPremierLeague},{"Ligue 1":TeamsLigue1},{"Bundesliga":TeamsBundesliga},{"Serie A":TeamsSerieA},{"La Liga":TeamsLaLiga}]

      // console.log("Maximum Goals Scored by Any Team:", maxGoals);
      // console.log("Minimum Goals Scored by Any Team:", minGoals);

      // console.log("Number of teams in each league: ");
      // console.log("La Liga: ", TeamsLaLiga.length, " - Teams: ", TeamsLaLiga);
      // console.log("Premier League: ", TeamsPremierLeague.length,"- Teams: ", TeamsPremierLeague);
      // console.log("Ligue 1: ", TeamsLigue1.length,"- Teams: ", TeamsLigue1);
      // console.log("Bundesliga: ", TeamsBundesliga.length,"- Teams: ", TeamsBundesliga);
      // console.log("Serie A: ", TeamsSerieA.length,"- Teams: ", TeamsSerieA);

      console.log("All teams and goals - ", allTeamsStats) 

      return {
        sumGoalsPremierLeague: sumGoalsPremierLeague,
        sumGoalsSerieA: sumGoalsSerieA,
        sumGoalsLaLiga: sumGoalsLaLiga,
        sumGoalsBundesliga: sumGoalsBundesliga,
        sumGoalsLigue1: sumGoalsLigue1,
        sumAgeLaLiga: sumAgeLaLiga,
        sumAgeSerieA: sumAgeSerieA,
        sumAgePremierLeague: sumAgePremierLeague,
        sumAgeBundesliga: sumAgeBundesliga,
        sumAgeLigue1: sumAgeLigue1,
        sumPlayerCountLaLiga: sumPlayerCountLaLiga,
        sumPlayerCountSerieA: sumPlayerCountSerieA,
        sumPlayerCountPremierLeague: sumPlayerCountPremierLeague,
        sumPlayerCountBundesliga: sumPlayerCountBundesliga,
        sumPlayerCountLigue1: sumPlayerCountLigue1,
        sumPassesLaLiga: sumPassesLaLiga,
        sumPassesSerieA: sumPassesSerieA,
        sumPassesPremierLeague: sumPassesPremierLeague,
        sumPassesBundesliga: sumPassesBundesliga,
        sumPassesLigue1: sumPassesLigue1,
        sumFoulsLaLiga: sumFoulsLaLiga,
        sumFoulsSerieA: sumFoulsSerieA,
        sumFoulsPremierLeague: sumFoulsPremierLeague,
        sumFoulsBundesliga: sumFoulsBundesliga,
        sumFoulsLigue1: sumFoulsLigue1,
        TeamsPremierLeague: TeamsPremierLeague,
        TeamsLigue1: TeamsLigue1,
        TeamsBundesliga: TeamsBundesliga,
        TeamsSerieA: TeamsSerieA,
        TeamsLaLiga: TeamsLaLiga,
        LaLigaBin: LaLigaBin,
        SerieABin: SerieABin,
        BundesligaBin: BundesligaBin,
        Ligue1Bin: Ligue1Bin,
        PremierLeagueBin: PremierLeagueBin,
        totalGoals: totalGoals,
        LeagueAvgAge: LeagueAvgAge,
        LeaguePasses: LeaguePasses,
        LeagueFouls: LeagueFouls,
        leagues: leagues,
        allTeamsStats: allTeamsStats
      }
  }
  catch (error) {
    console.error('Error reading CSV:', error);
    throw error; // Rethrow the error to propagate it
  }

}


// function readCSV() {
//   console.log("Into read csv")
//   fetch(playerData)
//       .then(response => response.text())
//       .then(data => {
//           const rows = data.split('\n');
//           const headers = rows[0].split(',');

//           // console.log("rows : ", rows[0]);
//           const result = [];
//           for (let i = 1; i < rows.length; i++) {
//               const values = rows[i].split(',');
//               const obj = {};
//               for (let j = 0; j < headers.length; j++) {
//                   obj[headers[j]] = values[j];
//               }
//               result.push(obj);
//           }
//           // console.log("result - ", result);
//           // Call the function to create a bar graph

//           console.log("result - ",result)
//           return dataExtraction(result);

//       })
//       .catch(error => {
//           console.error('Error reading CSV:', error);
//       });
// }

// // Call the function to read the CSV file
// // readCSV();

// module.exports = {
//   dataExtraction,
//   readCSV
// };

export default dataExtraction;

