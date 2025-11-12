// frontend/src/pages/HomePage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- SVG Icons for Feature Grid ---
const icons = {
    aiMatch: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A2342" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>,
    verified: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A2342" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
    secure: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A2342" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
    chat: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A2342" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
};

const HomePage = () => {
    const [location, setLocation] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/find-lawyer?loc=${encodeURIComponent(location)}`);
    };
    
    // --- UPDATED: Placeholder data for featured lawyers ---
    const featuredLawyers = [
        {
            name: "Adv. Surya Bussa", 
            field: "Family Law", 
            exp: "15 Years Experience", 
            imageUrl: "data:image/jpeg;base64,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" // Replace this URL
        }, 
        {
            name: "Adv. Harshitha", 
            field: "Criminal Law", 
            exp: "12 Years Experience",
            imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhMTEhMVFRUVFRIVFRUVFxUVFRUVFRUXFxUVGBUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGi0hIB0tLS0rLS8tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0rLSstKy0tLS0rLS0rKy0tLf/AABEIALYBFQMBIgACEQEDEQH/xAAcAAABBAMBAAAAAAAAAAAAAAAEAAIDBQEGBwj/xABAEAACAQIDBQUFBgQFBAMAAAABAgADEQQhMQUSQVFhBhMicYEyUpGhsQcUQnLB0SNikvAVM0OCoiRTc/FEwuH/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQIDBAX/xAAkEQEBAAIBBAICAwEAAAAAAAAAAQIRAxIhMUEEExRhInGBMv/aAAwDAQACEQMRAD8A5PJ6GkhtCMOMoEkdaYtMwMFbxoElAjYDbRpj40wJVGkt9pj/AKcSqQaSz2v/AJCzU8JWsy0wlS9PctfnIsHsp3z0HMy/wux0UZknymVVtJAvECF0lB94+QtLmhhKa6KPrClAHKBSU8I7HKmfUw6jsup7qiWtMiFCoIFTT2fU5qPSELs6p749BDxUEkpVReQAf4a/v/KPXZbn/UPwlj3oEbUSpUPdUbBmHic5impyvb8THOw6G8luu9axxtuoqMaq0bd5XsToLXY+SjOADa1O9jUderU3A+k37ZXZCnTG9Yu59p3N2J/SB7X2HRYkPSQnibC/xnK82vT0Y/G377tbwh70XpVVbnlmPMQtNl1m0CmUm1ezBonvcMxBXPLJh5EajpNg7E9q99zSxG4pAurjwhiLArY8c7+hynTHKZeHHPjuF1WD2VxDfgQ/35SJ+xmI/wCwp8msZ06jWW3CTJXGsrLkZ7NV0uO4qj8pB+hkRwtZBY74/OjAfEidmFQGZYqdQIHFhUfioPkYyvh0foZ1/FbHw1T2qSnrYX+Mpsb2LoNfu2ZDyvvD4GByLEUypsZWJ7Rm/wDaLsZiEG8oFQD3cjbynPzcMwIIIOhyM0iSRvTjt6OEgytETEeHikVQiE4YZQcQvD+zNMn2iAjpgShGNjyI20BsxMkxq6yCemMxLLH4pbInIZwBFzEEqv4zeXaLqniYTQxBlEMQJKmMPAXmWmyUsRMHE24ynoU6zaKR5w+jsiofaa0AunjYSuOEZh9kKNSTLGlgkUXsIAgrMdAZsvZrYZreJ2KjkNZVi3DhN17HDwXgTYzs/h6aAd3ck+0Sb/GUuwKYF2UZM7Hnley5+QE27a4uF85z/DYyqqFadRKYQWuVLs1h4myyUefIzhy+o9Xxp5rcamP3RNb2niWYm0qtnY6tVD3bvCATcC398ZQYhWqsd+oyKCd4726o8ySB8TOO7bp7JjMZta4jEst94GaTt5LOWUWvnbrrLkNTVt2lU3gD4vHvow53BIv1BgfaamAqkW8QI9RxnXjmq8/PerFtvYTbnf0FpliKiCxGlwOI6cPhNkqVqgGRM472T2oaNYOTcMr71zu+IeIZ8zpw9rUTtP3feXwsRocxOuUrySz2DbF1h+I5xp2tVH47+ckr4OrwKn5SqxWExCi5oEjmpU/rJurqLZe0FUa2yhVHtIL+IW6zS6+0HX2qbjqVNvjGUdqrzEbp0x0FNvITrNb7T7Iw+KBZbLUGjDj585W0qwIyhVOnbO8dR0uc16BRirZEG0beXnbOiLo4GZyM16krHhOk7xi9k9xzmI4YRzyihFCDDqGglapMKpMTKgstEBIBeZ35RPIyY1qsyi3kDS0S6wlaAkqUgICwwNxlM4nZwZr3sITShCLeAJhtloNRfzlrhcMo0USOlrDKcAvDrCIOHsJLTJOcCZM4XSp5SCkLwxZFNNGbt2Wp/wAMTUVXKbt2fW1NYBG2luAPP6Tn+M7GLiUV7rcgXFS7KOoW9p0Lao9mcw2jt9gndA6tuZcc/wBpw5rqx7Pizcs/ptHZfYdLDUrKwYWbxWCgk62AytlKbFbMwzNuOShcsUYWtfQjO4+MG2hhltdcVuHdA7sksoAGgH4ZragUySa2/kbXJGfS84729XTpb4nsrSoEvvBjwyA+kptp0AVW/BssrjPS45SUbRNUC5y58MpHtHG01NNXIAKlzfIWXW/xm8bXPOYyNKIC1KgtbdZ8uXj09Bl6TtHYnbBxGH3iRvI24TxPhU5jnn624aTh4qg1CxvZnZjfWzMTa/rOk/ZXih/FpnPeIIPWxstvJWN+nlPU+b7dHd4je1rmYt0iAsM85FN3MjcAg84JUwFMjxU0a/MQxzlr6RhYcIFU2xcPwTd/KSPpI62yEHs1GHQ5/pLNn5SKpnkRJqL1Vqu2ezVWpbdqIbcDl9Lyiq7CxCa07ge6R+s6GyjWM3bDUyzsl7ubnDVR/pv/AEn9Ip0QubnL5D9opdppwlYVhoKITQGU1ETmYiWZMrJtRdJPRWRPwhKCRpKseJgcJldZBNShdFYPREMpawJKSQqkkipEQtLQHql/STKZhXEyzjpAJpmEq8rFxIvmZIdoKOMirmgL6zedhrZF8pz/AGd3lX/LRm+Q+Jm/bJp1FUBlt6yCfaYzXlOT9qqSfeWQ/iFOoR+bI/MN8Z1HaTksBvLcC9pxnt/jWGO3LDeUUwltCrkWUchc5zGePVHbi5Oi7bVsjH0MKhp9wLZkNkSQ19d4HnzlJ2l2sMTddwBdSMrnXWwA4mR7J7ThqQFVBldcxexU2I+IlXtPbCk2RQB0FvnPNOreq+heizqhYNRcKBZRyyHlKPF4gVcRirld1MNWVQxA8QFhu343c6a2hlLFsbjQTWMen8dx/MT8c56OPHu8XPl20ip3sbTefs5xQTEE8N0ZdCQt/PeYfMcZpCE6/wB5Zzaux4vVphBd7N4SSpZjn4ToCoBIuM/nOzyu1kxjVJFs7EGpSR+d+mhIvbhppHVFPpMtGluJ4yGpU4R5WRssCMNmI9m+sbR0+URW8BlV+AkW8dI6oxjQMyYDar2OUUeVvFA4QBCcOMoPwhFHSbjFSXmVjZkSocdRCk1gpU3EmVWkrQsRy2kCo0lShzkE1OoLwj7wB1jaeGWFUaQECFK7HRTJ1708IbThCsIAa4epzAky7Mv7TEwzllDaC3zgA4fZi8ReWuHwqAeyJnck4XlIrZ+zK2TlebINJr+x6qU6W/UdUUas7BQPU5Qk9qMEP/k0vRt76RJaWoNpC9Q36TjXbasDiGCLvMarKCbZlUFxnw8Vh+W86ZtTtThAWZahe+gVWvp/MBYec5V2v2slSsxpi28w3VIF96wW5te7S9NTqgjYWC3UYG5Bepbe1IB3c78bgyLGYWxOU2bZGyW+64Y/i7sX9bE/WMxuyjugcb59BPDct5Wvr44a45GmBTe0qtp0ld95Tnox4ZcRz4/AS924oQ7i6/iPIcukp6VAme7hwtm6+X8jknVqegNO4Qgg+1x4GxAy9RNt7EOu7vX3Wp1e83rC5dl3aCaZKzCoD59ZXU8HcZ6ZH1GnwvLHY27hzoSjbpZSfasd5R5DPz46TpeK+nGckdV2em5UNJHG7uK4U/gLMwYA+6d29uBPWW/dE8AfWaL2d7SUWrFal0LqiKWIIyqVWVS98sqiAX1I8pt7oOGVpyuNnl0mUvhLWoH3fmJB3YA9lh6GKu5A9o56ZnKCU8bVsVLA2ORt9ZFEuq9MoypRmfvTnJgNJE1fPNfWBFVpzBTpFUrqbjxD4/vFTri1t74/+pF0Z3fpFCA62F3X5fvFGzTz2RCKGkgJktE5TpGKmiGsxMpmZakFJJ0MiSSJMqkMnp8JDJaUAtYVTEGSToYBAPCSUNYMWzhWGUQLJFyEKoJB8NLGio9ZFPFPjFUqqilmNguZ/YdZMqzUe021S7FBYol94e+eLA8bcprDHqrOV1EW2NtPXI3rhVJ3E4Lwv1J5wVDxg4Gg1sBDGsi7x/8AZnrk081oDaWI3FJJ8gP1POF9gey/3pziKxPdoTurpvNxYnoDl1mwbM+zKpjMMtepV7t3YOlMjJqR4seBbUdAL65btsbY60EFFBbdytbPzni+RyXeo9/xePH/AKqRsKoUACwA+Uoe0mMp0KRa287XVPd3ra34gdL8srzbl2Yqgu+4gUEkkDIAXJ/szknaLahxNdnF+7Xw0weCDQkczqfO3Cc+Hg6r38OnP8mY4/xvdruKUk3OZJuTzMnp0ABnkJJTp7zdBIdqVc1pjjr5T6OtPl72erixJyH0ECXF71yoLX1N7KByvz6D1jtsHwLTGrkDLW2p+UxYhQMgAMgM7fp8pLe6ydtoXqc517sfialTB0GfXdYXOrBGKqT6ATjdWdn7Hi+Cw3/jHyJE48vh14/IvFXINuHKQbPQgHeGZaWCKBpIKbHea+l/0nB3YaD1GOcJqGDMc7QBtZhjqBJmEi3czAGB5iKSFJmEcMvJqekF3oSpym0SAx1IZyEGTUIBiSVZEslUSCYCT05ADCEgEKIQgykNOTnSAr8obQS9pX0BLfBiwgHYcSwpiV9Mywwukiodu4zu6J3TZm8KnlzPw+omg1MyozB3hcXuPzKfKXXabHlqpA8S0/DYGzfzEXyOeXpKaiQzAqb5G3rl+pnowx1HDO7o/B0t4luF/jNg7J7EGNxYVxejQAeqODE+zTPnbPoGlI1UKAo4TqX2X4VVwXeD2q1Wq7H8rFAPQL8zN8l1izhN1t8a5/aZvIgwzY5AX8gOJnleho32o7aKU1wqGzVRvPzFMHIf7iD6L1nNt2wtJtvbY+84qtXvkznc6IvhT/iB8TK6piJ68JqPLnbaITLPlnKvDP3lYsdBlHYvFWQgamQ4Zu7pM51t9Yt7knY8v3ldm4ILep//AAR+KMzs+ju0gT7T+M889PlaQ4t49L7Bu07T2JJOAw5/kYfB2H6TihM7b2IQrgMPfTcY/wBTsw+RnHk8OvH5WxI9ZAF8Tcrwh+nGDOfa85wdmX+kGf6ydhcSIiBFu6dJE3KTjyjNzpAEKWJmYRUI4xQPPwtJg0G7u0mDTTJ4MJwx1gm9J6BygHIZMhgiNJkaUFIYQjQSmZMDnILCi0nqPlAVe0d3l4BuH1lxR0lPhjpLnDsCIBdEzO0cZ3VMkGzNcL0PP0/aYpCa1tzFtVqbqAt+BFAJLHkFGZJOluk1hjus5XUVtWsSSDrmb/qOfWQ7OrWqHqCfXj+kv+1HZOph6KVqdTvqZUF2A3WpPxuM/DfjrzE1rE4GvQ7ipWp7i103qZuCGVhfgcj7JscxcTp9kvhn68p5g3EYmda+yPaAfBtT40qj/B/GD8Sw9JxLv+enPlN1+ynbIw+MNOo1krLu34b4N0/+w/3Rndwxmq7PiKxDKo46zWPtL24MNgnQH+JW/hLzAb2z/QG9SJf1a3jDcB+04r9qe1jVxYp3uKS5/mexP/ELOUbrXRWkbVoIalpC1WdetjoEtULtYR2I/iOlBcwM2621H985XnElRlrLDYVEhWc6vl/tH7n6RLu6SzXdaVDc2HqefQchK/EGGVHygVY2F51rnA4Gc9AYPD93SpU+CU0T+lQP0nDdgYbvMRRTXeqUwfIsL/Kd4qG5nn5HbjYbL9pAU18zCN3hBhq3nOTqWgg9RhJ6mcFCQMltIx6vDykgp5RjJmIETAkmZkjRQOE/c196Z+4D3oEC8z3jzbIv7gPeklLB24iA968QxDSCwakRxmEeVrYppPTcwLSm0IptKuhW5w6i0A4tH0YPeTUzAssJLXDHnKjD5S0oGQRdosatOiVI3jUyC9AQSSeA0+ModjYuuK9F6e4hDpZnVmVQTYsWFhYAm/1kW3a5fEtf2aYVR1Nrn5kxJiuuQ9BO2E7OeV7uwDa+HLFmq0Gc5OocFXHvrc6kcPTrKHtDsha2HeiuSKveYY2FltmFU8hlYcstJz5cSz5IMveOS/AZwqnj2p2H3lwRoqGwBtbyGRM45fG9416sfl+ssWv1abU23agsSqMRrk6hgR6ETG+VtnlcFGGoPDOXlfDCtYvc2FgSwva5NvCOpjV2XRAsS3lf953nHlp5Lnjt0bsv2o/6NHrOpLFwQNVC+Ek8je5tytOR7QxnfVq1Zvxu7ehPhHwsJtvZvs5UqrVWgx3SpBaoRuozC1xYXZrcPKSt9lVYgD7yoH/jJv8A8hOWeWON1XbDDPObk7Od1a1z0kT1J1XA/ZRSUg1q9Sp/KoFMH6n4ETYsH2XwWHINOhTDDRm8Tf1NczleaO+Px8r5ch2D2UxOLPhXu6Y9qrUuqAfy3zY9B6kTdvuOzKClalaozKALKVUZcsrzecScrmklQDgWH0ItNZxGFwuJLU69E0Hz3CAEv1VgLN85y+7K3zqO8+PjJ43f21/bGH2aKLVKOJcPlu0m3Wv0ysR55zUKtXeN+HCWe39iHDPYi6n2H4MP0PSVBM9vHb0+dvncs/l403j7LNmd5iHrHSkuX53uB8t75Tqe6LnpNc+zvZvc4JGI8VYmofI2CD+kA+pmw1BaYzu61jNRlalh+sHvkfzGSPlIxkPUzDSAtYGNpzJF787yQUiJFhoMwRxj1pZzG5IujGMUW7My7TTgJEyFhAwR5x4wB94TowD3Y1khy4An8Qi/ww+8IFW6TN85aHYzH8QkLbFfgwgCpDcO8YdlVBxEZ3TrkZBZo0IQyspM3OEKz8xAuKD6S1o1JrKF+kKp1qvC0Cp23VtXqj+a/wAQDBVqX105S0x+yqtV98WubX5Gwtf6Svr7PqJ/mIw62uvxGU1KmibFMcgd0fMxyVlXzkCUkP47QmlQojMtebm2bowVWqGwGXSGphCou5P5QcyeXSY+/BcqYA68ZV7VxjbygG2VzbmZbdT9pO9/TpHZvaDUaQUNbxFjbTO37Ta8D2hWoCLgka2IM4EKbP7TE+ZJHzhOHwr0zdGIPNGKNblcG88X0ZXvt9D8rGSTp8O91Np5ZAjzlA22aJcipUptY7tu8UWvwtfWclxFV2yqVax6M7MPgTaQrhxwI+Efj33T8uTxi6jtPA1zvHB1rWF+6rG6nor6j1vK6n2w3rYXH0TTbIeL2ejBtR5j4zTMFtKvQ/y6hAOo1U/7TlLTana569DuKlGnqDv5kqRbNQfZOVtZPps7L+TLNy/55bbt2rRo4QrW/jU6g3aVrd4jgErZuX8w14jnouwNmNia9OiurHM+6ozZvQXlYATYctBOpfZnsxadJsQwJepdQQL7qKcx5lhn5CejDHoxeXlz+zLem9gKihRkAAB0AFhGk3EGfGLf2XP+0wf/ABAXvZrflP7TO00PKkHOQbxsR1NpGmPTUk+oN5HQx9M7xLWzNr5QLPZGFFRCSdDaHNs06b0E7JuDSYggg1HseecvJFVDbMPBvlGNsw+98pb2jGEaN1VHZZ4NMS0BAijRuvK4xxjvvxjlpiP7oTbCIY4x42gesd3Yi7scoCG0zzMwdptzMwVEZYQHNtM8zIfvhJmXURirAtMM+ULVtJV0akLp1YFpReF0qglXTeF0mgW+GeWlJxKKiZZ0a2UirE4Wm2Zpox6qp/SWWyuz+Fqq4q0qYUAksFQEWFyb2lTQqQvbG0Vo7OxbnMujUVGl2rDcGnIMW8lMVZdOT7Qx6VGVqNIUhu2Kg3BNzn0yIy6QR/Fnaxt6TFLXzkpFtSB5zUjNu7syjSbnJzTccDIxWUcfhM/fjwv8Zeydzt9uRmLH3ZG2MY8pGazH8X0gEgNEQOJHxgrOTqSY0SKsFqAC4OfDpNt7AdrRhn7isf4FQ33/APtuct4/ymwvyyPOaRTGsc5mvTPt6SLXAsQQbWI48rRgUzmH2Z9rdxlwldvAxtQdj7DH/TJ90nTkcuOXUzOdmm5TTT6DPoILiMAlQWdQRnwham8Tmw85FZ7I4cU6G4MgHcD4y7BlV2cHgb8xlnE8LfJXkTNHkRhhGGMUVpiB5fDzJqRRTTJb8aWiigRkmYsYooGShi7g2veKKBhLiT03iigF0qkOotFFANpPLLDZRRQD8Ob+k177Qccd2hQHs+KqerZovwG//VMRSRWmxrLqeVooppGEWP3JmKAt2YtMxQGmOEUUCWlxmHiimvTPswztn2cbfbF4YrVualEqjP74I8LH+awsedr8YopmtRtYy0jOpmYphoTsAWRvzGWRiiiLfJGR3iihDCSIoooH/9k=" // Replace this URL
        }, 
        {
            name: "Adv. Rohan Gupta", 
            field: "Corporate Law", 
            exp: "20 Years Experience",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD_FFw9H07sJDBZsuyo7r6ViqZZp3gzibtNf68cqFV0epgEcxdGefld2DwinViBsLA-EU&usqp=CAU" // Replace this URL
        }, 
        {
            name: "Adv. Anitha Senoy", 
            field: "Property Law", 
            exp: "10 Years Experience",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs-OiEQQCTgLLKq5sdItbfOF8BS75avzhZ_g&s" // Replace this URL
        }
    ];

    // --- STYLES ---
    const pageStyle = {
        fontFamily: "'Lato', sans-serif",
        color: '#333',
        backgroundColor: '#FFFFFF',
    };
    const containerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
    };

    // --- 1. Hero Section ---
    const heroSectionStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '6rem 2rem 5rem 2rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e5e7eb',
    };
    const heroTitleStyle = {
        fontFamily: "'Merriweather', serif",
        fontSize: '3rem',
        fontWeight: '700',
        color: '#0A2342',
        marginBottom: '1rem',
        lineHeight: 1.2,
        maxWidth: '700px',
    };
    const heroSubtitleStyle = {
        fontSize: '1.25rem',
        color: '#555',
        lineHeight: 1.6,
        marginBottom: '2.5rem',
        maxWidth: '600px',
    };

    const sectionTitleStyle = {
        textAlign: 'center',
        fontFamily: "'Merriweather', serif",
        fontSize: '2.5rem',
        color: '#0A2342',
        marginBottom: '1rem',
    };
    const sectionSubtitleStyle = {
        textAlign: 'center',
        fontSize: '1.1rem',
        color: '#555',
        marginBottom: '4rem',
    };
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2rem',
    };
    const stepsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2.5rem',
        maxWidth: '1100px',
        margin: '0 auto',
    };
    const stepTitleStyle = {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#0A2342',
        margin: '1rem 0 0.5rem 0',
    };
    const buttonPrimary = {
        backgroundColor: '#0A2342',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '0.8rem 1.5rem',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '1rem',
        textDecoration: 'none',
        display: 'inline-block'
    };

    const featuredSectionStyle = {
        padding: '5rem 2rem',
        backgroundColor: '#FFFFFF',
    };
    const lawyerCardStyle = {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
    };
    
    // --- UPDATED: Image Style ---
    const lawyerImageStyle = (imageUrl) => ({
        width: '100%',
        height: '200px',
        backgroundColor: '#e0e0e0',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    });

    const lawyerCardContentStyle = { padding: '1.5rem' };
    const lawyerNameStyle = { fontFamily: "'Merriweather', serif", fontSize: '1.25rem', fontWeight: '700', color: '#0A2342', margin: 0 };
    const lawyerTagStyle = {
        display: 'inline-block',
        backgroundColor: '#e8f4fd',
        color: '#0A2342',
        padding: '0.25rem 0.75rem',
        borderRadius: '999px',
        fontSize: '0.8rem',
        fontWeight: '600',
        margin: '0.5rem 0',
    };

    const featureSectionStyle = {
        padding: '5rem 2rem',
        backgroundColor: '#f8f9fa',
    };
    const featureCardStyle = {
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        border: '1px solid #e5e7eb',
    };
    
    const howItWorksSectionStyle = {
        padding: '5rem 2rem',
        backgroundColor: '#FFFFFF',
    };
    const stepCardStyle = {
        textAlign: 'center',
        padding: '2rem',
        background: '#f8f9fa',
        borderRadius: '18px',
        border: '1px solid #e5e7eb'
    };
    const stepNumberStyle = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#D4AF37',
        display: 'inline-block',
        border: '2px solid #D4AF37',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        lineHeight: '50px',
        marginBottom: '1rem',
    };
    
    const lawyerCtaStyle = {
        padding: '5rem 2rem',
        backgroundColor: '#4a6586ff',
        color: 'white',
        textAlign: 'center',
        borderRadius: '18px',
        margin: '0 2rem 5rem 2rem'
    };
    const lawyerTitleStyle = {
        ...sectionTitleStyle,
        color: 'white',
        textAlign: 'center',
        marginBottom: '1rem',
    };
    const lawyerSubtitleStyle = {
        ...heroSubtitleStyle,
        color: '#e0e0e0',
    };
    const lawyerButtonStyle = {
        display: 'inline-block',
        padding: '1rem 2.5rem',
        backgroundColor: '#D4AF37',
        color: '#0A2342',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
    };

    return (
        <div style={pageStyle}>
            <section style={heroSectionStyle}>
                <h1 style={heroTitleStyle}>Find Your Trusted Lawyer in India</h1>
                <p style={heroSubtitleStyle}>
                    Expert legal guidance starts here. Describe your issue or search by specialty to connect with a verified professional near you.
                </p>

                {/* RECTANGULAR SEARCH BOX */}
                <form 
                    onSubmit={handleSearch}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        maxWidth: '700px',
                        background: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        marginTop: '1.5rem',
                        height: '65px',
                        position: 'relative',
                    }}
                >
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        flex: 1, 
                        paddingLeft: '1.5rem',
                        paddingRight: '6rem', 
                    }}>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="22" height="22" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="#777" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            style={{ marginRight: '0.75rem' }}
                        >
                            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>

                        <input
                            type="text"
                            placeholder="Enter your location..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                fontSize: '1rem',
                                padding: '1rem 0',
                                fontFamily: "'Lato', sans-serif",
                                color: '#333',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            position: 'absolute',
                            right: '5px',
                            top: '6px',
                            bottom: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'linear-gradient(135deg, #0A2342, #3d4753ff)',
                            color: '#fff',
                            border: 'none',
                            padding: '0 1.8rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease, transform 0.1s ease',
                            boxShadow: '0 3px 8px rgba(0,0,0,0.12)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="18" height="18" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="white" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        Find Lawyers
                    </button>
                </form>

                <div 
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'nowrap',
                        gap: '2.5rem',
                        marginTop: '3rem',
                        width: '100%',
                        maxWidth: '900px'
                    }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{...stepTitleStyle, margin: 0}}>10,000+</h3>
                        <p style={{color: '#555', margin: '0.5rem 0 0 0'}}>Happy Clients</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{...stepTitleStyle, margin: 0}}>1,500+</h3>
                        <p style={{color: '#555', margin: '0.5rem 0 0 0'}}>Verified Lawyers</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{...stepTitleStyle, margin: 0}}>25+</h3>
                        <p style={{color: '#555', margin: '0.5rem 0 0 0'}}>Cities Covered</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{...stepTitleStyle, margin: 0}}>4.9/5</h3>
                        <p style={{color: '#555', margin: '0.5rem 0 0 0'}}>Average Rating</p>
                    </div>
                </div>
            </section>

            {/* 2. Featured Lawyers Section */}
            <section style={featuredSectionStyle}>
                <div style={containerStyle}>
                    <h2 style={sectionTitleStyle}>Meet Our Top Lawyers</h2>
                    <p style={sectionSubtitleStyle}>Get to know some of the top-rated professionals in our network.</p>
                    <div style={gridStyle}>
                        {featuredLawyers.map((lawyer, i) => (
                            <div style={lawyerCardStyle} key={i}>
                                {/* --- UPDATED: Image now uses a URL --- */}
                                <div style={lawyerImageStyle(lawyer.imageUrl)}></div>
                                
                                <div style={lawyerCardContentStyle}>
                                    <h3 style={lawyerNameStyle}>{lawyer.name}</h3>
                                    <span style={lawyerTagStyle}>{lawyer.field}</span>
                                    <p style={{color: '#555', fontSize: '0.9rem', margin: '0.75rem 0 0 0'}}>{lawyer.exp}</p>
                                    <Link to="/find-lawyer" style={{...buttonPrimary, padding: '0.5rem 1.5rem', fontSize: '0.9rem', marginTop: '1rem'}}>View Profile</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* 3. Why Choose Us Section */}
            <section style={featureSectionStyle}>
                <div style={containerStyle}>
                    <h2 style={sectionTitleStyle}>A Platform Built on Trust</h2>
                    <p style={sectionSubtitleStyle}>We provide a transparent and secure experience from start to finish.</p>
                    <div style={gridStyle}>
                        <div style={featureCardStyle}>
                            <span style={{marginBottom: '1rem', display: 'block'}}>{icons.verified}</span>
                            <h3 style={stepTitleStyle}>Verified Professionals</h3>
                            <p style={{color: '#555', lineHeight: 1.6}}>Every lawyer on our platform is manually verified for their credentials and experience. No fakes, only experts.</p>
                        </div>
                        <div style={featureCardStyle}>
                            <span style={{marginBottom: '1rem', display: 'block'}}>{icons.aiMatch}</span>
                            <h3 style={stepTitleStyle}>AI-Powered Matching</h3>
                            <p style={{color: '#555', lineHeight: 1.6}}>Don't know what kind of lawyer you need? Our AI does. Get matched with the right specialist in minutes.</p>
                        </div>
                        <div style={featureCardStyle}>
                            <span style={{marginBottom: '1rem', display: 'block'}}>{icons.secure}</span>
                            <h3 style={stepTitleStyle}>Secure & Confidential</h3>
                            <p style={{color: '#555', lineHeight: 1.6}}>Your data is our priority. All communications and documents are encrypted in your private case room.</p>
                        </div>
                        <div style={featureCardStyle}>
                            <span style={{marginBottom: '1rem', display: 'block'}}>{icons.chat}</span>
                            <h3 style={stepTitleStyle}>Direct Communication</h3>
                            <p style={{color: '#555', lineHeight: 1.6}}>Once your booking is confirmed, chat directly with your lawyer, share files, and manage your case all in one place.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. How It Works Section */}
            <section style={howItWorksSectionStyle}>
                <div style={containerStyle}>
                    <h2 style={sectionTitleStyle}>Get Started in 3 Simple Steps</h2>
                    <div style={stepsGridStyle}>
                        <div style={stepCardStyle}>
                            <div style={stepNumberStyle}>1</div>
                            <h3 style={stepTitleStyle}>Describe Your Case</h3>
                            <p style={{color: '#555', lineHeight: 1.6}}>Use our simple, confidential form to explain your legal issue. Our AI analyzes your needs instantly.</p>
                        </div>
                        <div style={stepCardStyle}>
                            <div style={stepNumberStyle}>2</div>
                            <h3 style={stepTitleStyle}>Lawyer Accepts</h3>
                            <p style={{color: '#555', lineHeight: 1.6}}>A verified lawyer reviews your request and accepts it. You are notified immediately.</p>
                        </div>
                        <div style={stepCardStyle}>
                            <div style={stepNumberStyle}>3</div>
                            <h3 style={stepTitleStyle}>Book & Consult</h3>
                            <p style={{color: '#555', lineHeight: 1.6}}>Book a time slot, pay the fee, and connect with your lawyer in a secure, private case room.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. For Lawyers CTA Section */}
            <div style={containerStyle}>
    <section style={lawyerCtaStyle}>
        <h2 style={lawyerTitleStyle}>Are You a Legal Professional?</h2>
        <p 
            style={{
                ...lawyerSubtitleStyle,
                color: '#e0e0e0',
                maxWidth: '700px',       // ✅ limits the paragraph width
                margin: '0 auto 2rem',   // ✅ centers it horizontally with some bottom space
                lineHeight: '1.6',       // ✅ improves readability
                textAlign: 'center',     // ✅ ensures proper centering
            }}
        >
            Join our network to grow your practice, connect with new clients, 
            and manage your cases on a single, modern platform.
        </p>
        <Link 
            to="/signup?role=lawyer" 
            style={lawyerButtonStyle}
            onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
            Join the Network
        </Link>
    </section>
</div>

        </div>
    );
};

export default HomePage;