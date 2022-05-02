// This file handles much of the AJAX functionality for the statistics web page. It's focus is on the click events for each row, be it week or day statistics, and the display of corresponding reminders.

// It finds all statistic rows and then iterates through each of them, assigning an event listener for displaying and hiding info for each row.
let statisticRows = document.getElementsByClassName("statisticRow");

for (let row of statisticRows)
{
    row.addEventListener("click", () => {
        // It then finds all 'info' rows, or the rows that hold specific review names and ratings. 
        let infos = document.getElementsByName(row.id+"info");
        for (let info of infos)
        {
            // It iterates through the infos, toggling the hidden attribute to facilitate displaying and hiding the information for each row.
            if (info.hasAttribute("hidden"))
            {
                info.removeAttribute("hidden");
            }
            else
            {
                info.setAttribute("hidden", "");
            }
        }
    });    
}