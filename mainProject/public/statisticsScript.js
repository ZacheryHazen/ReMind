let statisticRows = document.getElementsByClassName("statisticRow");

for (let row of statisticRows)
{
    row.addEventListener("click", () => {
        let infos = document.getElementsByName(row.id+"info");
        for (let info of infos)
        {
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