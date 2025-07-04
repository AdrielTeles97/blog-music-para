import type { Music, MusicSubmission } from "./types"

// Mock data
const musicData: Music[] = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    artistId: "weeknd",
    album: "After Hours",
    genre: "Pop",
    releaseDate: "29/11/2019",
    duration: "3:20",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/blinding-lights.mp3",
    downloads: 15243,
    description:
      '"Blinding Lights" é uma música do cantor canadense The Weeknd, lançada como o segundo single de seu quarto álbum de estúdio After Hours. A música foi um sucesso comercial, alcançando o primeiro lugar em mais de 30 países.',
    postedBy: "Admin",
    postedAt: "10/01/2023 às 14:30",
    spotifyUrl: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
    youtubeUrl: "https://www.youtube.com/watch?v=4NRXx6U8ABQ",
    appleMusicUrl: "https://music.apple.com/us/album/blinding-lights/1499378108?i=1499378116",
  },
  {
    id: "2",
    title: "Shape of You",
    artist: "Ed Sheeran",
    artistId: "edsheeran",
    album: "÷ (Divide)",
    genre: "Pop",
    releaseDate: "06/01/2017",
    duration: "3:53",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/shape-of-you.mp3",
    downloads: 12876,
    description:
      '"Shape of You" é uma música do cantor e compositor britânico Ed Sheeran. Foi lançada como single em 6 de janeiro de 2017, junto com "Castle on the Hill", como o primeiro single de seu terceiro álbum de estúdio, ÷.',
    postedBy: "Editor",
    postedAt: "15/01/2023 às 09:45",
    spotifyUrl: "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3",
    youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    appleMusicUrl: "https://music.apple.com/us/album/shape-of-you/1193701079?i=1193701392",
  },
  {
    id: "3",
    title: "Bad Guy",
    artist: "Billie Eilish",
    artistId: "billieeilish",
    album: "When We All Fall Asleep, Where Do We Go?",
    genre: "Pop",
    releaseDate: "29/03/2019",
    duration: "3:14",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/bad-guy.mp3",
    downloads: 10932,
    description:
      '"Bad Guy" é uma música da cantora americana Billie Eilish. Foi lançada em 29 de março de 2019, como o quinto single de seu álbum de estreia, When We All Fall Asleep, Where Do We Go?.',
    postedBy: "Moderador",
    postedAt: "20/01/2023 às 16:15",
    spotifyUrl: "https://open.spotify.com/track/2Fxmhks0bxGSBdJ92vM42m",
    youtubeUrl: "https://www.youtube.com/watch?v=DyDfgMOUjCI",
    appleMusicUrl: "https://music.apple.com/us/album/bad-guy/1450695723?i=1450695739",
  },
  {
    id: "4",
    title: "Uptown Funk",
    artist: "Mark Ronson ft. Bruno Mars",
    artistId: "markronson",
    album: "Uptown Special",
    genre: "Funk",
    releaseDate: "10/11/2014",
    duration: "4:30",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/uptown-funk.mp3",
    downloads: 9876,
    description:
      '"Uptown Funk" é uma música do produtor britânico Mark Ronson, com participação do cantor americano Bruno Mars. Foi lançada como o primeiro single do quarto álbum de estúdio de Ronson, Uptown Special.',
    postedBy: "Admin",
    postedAt: "25/01/2023 às 11:20",
    spotifyUrl: "https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS",
    youtubeUrl: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
    appleMusicUrl: "https://music.apple.com/us/album/uptown-funk-feat-bruno-mars/1440766282?i=1440766712",
  },
  {
    id: "5",
    title: "Despacito",
    artist: "Luis Fonsi ft. Daddy Yankee",
    artistId: "luisfonsi",
    album: "Vida",
    genre: "Reggaeton",
    releaseDate: "12/01/2017",
    duration: "3:47",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/despacito.mp3",
    downloads: 8765,
    description:
      '"Despacito" é uma música do cantor porto-riquenho Luis Fonsi com participação do rapper Daddy Yankee. Foi lançada em 12 de janeiro de 2017 pela Universal Music Latin.',
    postedBy: "Editor",
    postedAt: "30/01/2023 às 13:40",
    spotifyUrl: "https://open.spotify.com/track/6habFhsOp2NvshLv26DqMb",
    youtubeUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    appleMusicUrl: "https://music.apple.com/us/album/despacito-feat-daddy-yankee/1447401519?i=1447401620",
  },
  {
    id: "6",
    title: "Someone Like You",
    artist: "Adele",
    artistId: "adele",
    album: "21",
    genre: "Pop",
    releaseDate: "24/01/2011",
    duration: "4:45",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/someone-like-you.mp3",
    downloads: 7654,
    description:
      '"Someone Like You" é uma música da cantora britânica Adele. Foi lançada em 24 de janeiro de 2011 como o segundo single de seu segundo álbum de estúdio, 21.',
    postedBy: "Moderador",
    postedAt: "05/02/2023 às 10:10",
    spotifyUrl: "https://open.spotify.com/track/1T4twk3Ub4W0TfY9zZdvF2",
    youtubeUrl: "https://www.youtube.com/watch?v=hLQl3WQQoQ0",
    appleMusicUrl: "https://music.apple.com/us/album/someone-like-you/403037872?i=403037882",
  },
  {
    id: "7",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    artistId: "queen",
    album: "A Night at the Opera",
    genre: "Rock",
    releaseDate: "31/10/1975",
    duration: "5:55",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/bohemian-rhapsody.mp3",
    downloads: 6543,
    description:
      '"Bohemian Rhapsody" é uma música da banda britânica Queen. Foi escrita por Freddie Mercury para o álbum A Night at the Opera, de 1975. A música é uma suíte de seis partes sem refrão.',
    postedBy: "Admin",
    postedAt: "10/02/2023 às 15:30",
    spotifyUrl: "https://open.spotify.com/track/7tFiyTwD0nx5a1eklYtX2J",
    youtubeUrl: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    appleMusicUrl: "https://music.apple.com/us/album/bohemian-rhapsody/1440806723?i=1440806930",
  },
  {
    id: "8",
    title: "Billie Jean",
    artist: "Michael Jackson",
    artistId: "michaeljackson",
    album: "Thriller",
    genre: "Pop",
    releaseDate: "02/01/1983",
    duration: "4:54",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/billie-jean.mp3",
    downloads: 5432,
    description:
      '"Billie Jean" é uma música do cantor americano Michael Jackson. Foi lançada pela Epic Records em 2 de janeiro de 1983 como o segundo single do sexto álbum de estúdio de Jackson, Thriller.',
    postedBy: "Editor",
    postedAt: "15/02/2023 às 09:25",
    spotifyUrl: "https://open.spotify.com/track/5ChkMS8OtdzJeqyybCc9R5",
    youtubeUrl: "https://www.youtube.com/watch?v=Zi_XLOBDo_Y",
    appleMusicUrl: "https://music.apple.com/us/album/billie-jean/269572838?i=269573364",
  },
  {
    id: "9",
    title: "Rolling in the Deep",
    artist: "Adele",
    artistId: "adele",
    album: "21",
    genre: "Pop",
    releaseDate: "29/11/2010",
    duration: "3:48",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/rolling-in-the-deep.mp3",
    downloads: 4321,
    description:
      '"Rolling in the Deep" é uma música da cantora britânica Adele. Foi lançada em 29 de novembro de 2010 como o primeiro single de seu segundo álbum de estúdio, 21.',
    postedBy: "Moderador",
    postedAt: "20/02/2023 às 14:15",
    spotifyUrl: "https://open.spotify.com/track/7h9od9AyfwbdGNicYV3V9M",
    youtubeUrl: "https://www.youtube.com/watch?v=rYEDA3JcQqw",
    appleMusicUrl: "https://music.apple.com/us/album/rolling-in-the-deep/403037872?i=403037873",
  },
  {
    id: "10",
    title: "Imagine",
    artist: "John Lennon",
    artistId: "johnlennon",
    album: "Imagine",
    genre: "Rock",
    releaseDate: "11/10/1971",
    duration: "3:03",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/imagine.mp3",
    downloads: 3210,
    description:
      '"Imagine" é uma música escrita e interpretada pelo ex-Beatle John Lennon. Foi lançada como single e como faixa-título do álbum Imagine, em 1971.',
    postedBy: "Admin",
    postedAt: "25/02/2023 às 11:50",
    spotifyUrl: "https://open.spotify.com/track/7pKfPomDEeI4TPT6EOYjn9",
    youtubeUrl: "https://www.youtube.com/watch?v=YkgkThdzX-8",
    appleMusicUrl: "https://music.apple.com/us/album/imagine/1440857098?i=1440857490",
  },
  {
    id: "11",
    title: "Dance Monkey",
    artist: "Tones and I",
    artistId: "tonesandi",
    album: "The Kids Are Coming",
    genre: "Pop",
    releaseDate: "10/05/2019",
    duration: "3:29",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/dance-monkey.mp3",
    downloads: 2987,
    description:
      '"Dance Monkey" é uma música da cantora e compositora australiana Tones and I. Foi lançada em 10 de maio de 2019 como o segundo single de seu EP de estreia The Kids Are Coming.',
    postedBy: "Editor",
    postedAt: "01/03/2023 às 16:40",
    spotifyUrl: "https://open.spotify.com/track/2XU0oxnq2qxCpomAAuJY8K",
    youtubeUrl: "https://www.youtube.com/watch?v=q0hyYWKXF0Q",
    appleMusicUrl: "https://music.apple.com/us/album/dance-monkey/1472639198?i=1472639605",
  },
  {
    id: "12",
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    artistId: "nirvana",
    album: "Nevermind",
    genre: "Rock",
    releaseDate: "10/09/1991",
    duration: "5:01",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/smells-like-teen-spirit.mp3",
    downloads: 2876,
    description:
      '"Smells Like Teen Spirit" é uma música da banda americana Nirvana. Foi lançada como o primeiro single do segundo álbum de estúdio da banda, Nevermind, em 1991.',
    postedBy: "Moderador",
    postedAt: "05/03/2023 às 10:30",
    spotifyUrl: "https://open.spotify.com/track/5ghIJDpPoe3CfHMGu71E6T",
    youtubeUrl: "https://www.youtube.com/watch?v=hTWKbfoikeg",
    appleMusicUrl: "https://music.apple.com/us/album/smells-like-teen-spirit/1440783617?i=1440783723",
  },
  {
    id: "13",
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    artistId: "harrystyles",
    album: "Fine Line",
    genre: "Pop",
    releaseDate: "15/11/2019",
    duration: "2:54",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/watermelon-sugar.mp3",
    downloads: 2765,
    description:
      '"Watermelon Sugar" é uma música do cantor britânico Harry Styles. Foi lançada em 15 de novembro de 2019 como o segundo single de seu segundo álbum de estúdio, Fine Line.',
    postedBy: "Admin",
    postedAt: "10/03/2023 às 13:20",
    spotifyUrl: "https://open.spotify.com/track/6UelLqGlWMcVH1E5c4H7lY",
    youtubeUrl: "https://www.youtube.com/watch?v=E07s5ZYygMg",
    appleMusicUrl: "https://music.apple.com/us/album/watermelon-sugar/1485802965?i=1485803179",
  },
  {
    id: "14",
    title: "Levitating",
    artist: "Dua Lipa",
    artistId: "dualipa",
    album: "Future Nostalgia",
    genre: "Pop",
    releaseDate: "27/03/2020",
    duration: "3:23",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/levitating.mp3",
    downloads: 2654,
    description:
      '"Levitating" é uma música da cantora britânica Dua Lipa. Foi lançada em 27 de março de 2020 como parte de seu segundo álbum de estúdio, Future Nostalgia.',
    postedBy: "Editor",
    postedAt: "15/03/2023 às 09:10",
    spotifyUrl: "https://open.spotify.com/track/39LLxExYz6ewLAcYrzQQyP",
    youtubeUrl: "https://www.youtube.com/watch?v=TUVcZfQe-Kw",
    appleMusicUrl: "https://music.apple.com/us/album/levitating/1504922400?i=1504922411",
  },
  {
    id: "15",
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    artistId: "gunsnroses",
    album: "Appetite for Destruction",
    genre: "Rock",
    releaseDate: "21/06/1987",
    duration: "5:56",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/sweet-child-o-mine.mp3",
    downloads: 2543,
    description:
      "\"Sweet Child O' Mine\" é uma música da banda americana Guns N' Roses. Foi lançada em junho de 1987 como o terceiro single de seu álbum de estreia, Appetite for Destruction.",
    postedBy: "Moderador",
    postedAt: "20/03/2023 às 14:45",
    spotifyUrl: "https://open.spotify.com/track/7o2CTH4ctstm8TNelqjb51",
    youtubeUrl: "https://www.youtube.com/watch?v=1w7OgIMMRc4",
    appleMusicUrl: "https://music.apple.com/us/album/sweet-child-o-mine/1377813284?i=1377813291",
  },
  {
    id: "16",
    title: "Believer",
    artist: "Imagine Dragons",
    artistId: "imaginedragons",
    album: "Evolve",
    genre: "Rock",
    releaseDate: "01/02/2017",
    duration: "3:24",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/believer.mp3",
    downloads: 2432,
    description:
      '"Believer" é uma música da banda americana Imagine Dragons. Foi lançada em 1º de fevereiro de 2017 como o primeiro single de seu terceiro álbum de estúdio, Evolve.',
    postedBy: "Admin",
    postedAt: "25/03/2023 às 11:30",
    spotifyUrl: "https://open.spotify.com/track/0pqnGHJpmpxLKifKRmU6WP",
    youtubeUrl: "https://www.youtube.com/watch?v=7wtfhZwyrcc",
    appleMusicUrl: "https://music.apple.com/us/album/believer/1411625594?i=1411625595",
  },
  {
    id: "17",
    title: "Shallow",
    artist: "Lady Gaga & Bradley Cooper",
    artistId: "ladygaga",
    album: "A Star Is Born Soundtrack",
    genre: "Pop",
    releaseDate: "27/09/2018",
    duration: "3:36",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/shallow.mp3",
    downloads: 2321,
    description:
      '"Shallow" é uma música interpretada por Lady Gaga e Bradley Cooper. Foi lançada em 27 de setembro de 2018 como o primeiro single da trilha sonora do filme A Star Is Born.',
    postedBy: "Editor",
    postedAt: "30/03/2023 às 16:15",
    spotifyUrl: "https://open.spotify.com/track/2VxeLyX666F8uXCJ0dZF8B",
    youtubeUrl: "https://www.youtube.com/watch?v=bo_efYhYU2A",
    appleMusicUrl: "https://music.apple.com/us/album/shallow/1437013374?i=1437013392",
  },
  {
    id: "18",
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    artistId: "ledzeppelin",
    album: "Led Zeppelin IV",
    genre: "Rock",
    releaseDate: "08/11/1971",
    duration: "8:02",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/stairway-to-heaven.mp3",
    downloads: 2210,
    description:
      '"Stairway to Heaven" é uma música da banda britânica Led Zeppelin. Foi lançada em novembro de 1971 como parte de seu quarto álbum de estúdio, Led Zeppelin IV.',
    postedBy: "Moderador",
    postedAt: "05/04/2023 às 10:20",
    spotifyUrl: "https://open.spotify.com/track/5CQ30WqJwcep0pYcV4AMNc",
    youtubeUrl: "https://www.youtube.com/watch?v=QkF3oxziUI4",
    appleMusicUrl: "https://music.apple.com/us/album/stairway-to-heaven/1440751462?i=1440751470",
  },
  {
    id: "19",
    title: "Lose Yourself",
    artist: "Eminem",
    artistId: "eminem",
    album: "8 Mile Soundtrack",
    genre: "Hip Hop",
    releaseDate: "28/10/2002",
    duration: "5:26",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/lose-yourself.mp3",
    downloads: 2109,
    description:
      '"Lose Yourself" é uma música do rapper americano Eminem. Foi lançada em 28 de outubro de 2002 como o primeiro single da trilha sonora do filme 8 Mile.',
    postedBy: "Admin",
    postedAt: "10/04/2023 às 13:40",
    spotifyUrl: "https://open.spotify.com/track/7MJQ9Nfxzh8LPZ9e9u68Fq",
    youtubeUrl: "https://www.youtube.com/watch?v=_Yhyp-_hX2s",
    appleMusicUrl: "https://music.apple.com/us/album/lose-yourself-from-8-mile-soundtrack/1440766214?i=1440766223",
  },
  {
    id: "20",
    title: "Thinking Out Loud",
    artist: "Ed Sheeran",
    artistId: "edsheeran",
    album: "x (Multiply)",
    genre: "Pop",
    releaseDate: "24/09/2014",
    duration: "4:41",
    coverUrl: "/placeholder.svg?height=400&width=400",
    audioUrl: "https://example.com/audio/thinking-out-loud.mp3",
    downloads: 1998,
    description:
      '"Thinking Out Loud" é uma música do cantor e compositor britânico Ed Sheeran. Foi lançada em 24 de setembro de 2014 como o terceiro single de seu segundo álbum de estúdio, x.',
    postedBy: "Editor",
    postedAt: "15/04/2023 às 09:30",
    spotifyUrl: "https://open.spotify.com/track/1Slwb6dOYkBlWal1PGtnNg",
    youtubeUrl: "https://www.youtube.com/watch?v=lp-EO5I60KA",
    appleMusicUrl: "https://music.apple.com/us/album/thinking-out-loud/1440857781?i=1440857795",
  },
]

// Helper functions
export function getAllMusic(): Music[] {
  return musicData
}

export function getMusicById(id: string): Music | undefined {
  return musicData.find((music) => music.id === id)
}

export function getTopDownloads(): Music[] {
  return [...musicData].sort((a, b) => b.downloads - a.downloads).slice(0, 10)
}

export function getRecentlyAdded(): Music[] {
  // In a real app, this would sort by date
  // Here we're just returning the first 6 items
  return musicData.slice(0, 6)
}

export function getRelatedSongs(currentId: string): Music[] {
  const current = getMusicById(currentId)
  if (!current) return []

  // Find songs with the same genre or artist
  return musicData
    .filter((music) => music.id !== currentId && (music.genre === current.genre || music.artist === current.artist))
    .slice(0, 3)
}

// Funções para gerenciar submissões de músicas
let pendingSubmissions: Music[] = []

export function submitMusic(submission: MusicSubmission): Promise<Music> {
  return new Promise((resolve) => {
    // Simular delay de processamento
    setTimeout(() => {
      const now = new Date()
      const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      
      // Criar nova música com status pendente
      const newMusic: Music = {
        id: `pending-${Date.now()}`,
        title: submission.title,
        artist: submission.artist,
        artistId: submission.artist.toLowerCase().replace(/\s+/g, '-'),
        album: submission.album || '',
        genre: submission.genre,
        releaseDate: submission.releaseDate || formattedDate,
        duration: '0:00', // Será calculado quando o áudio for processado
        coverUrl: submission.coverUrl || '/placeholder.svg',
        audioUrl: submission.audioUrl,
        downloads: 0,
        description: submission.description,
        postedBy: submission.submitterName,
        postedAt: formattedDate,
        spotifyUrl: submission.spotifyUrl || '',
        youtubeUrl: submission.youtubeUrl || '',
        appleMusicUrl: submission.appleMusicUrl || '',
        status: 'pending',
        submittedBy: submission.submitterName,
        submittedAt: formattedDate
      }
      
      // Adicionar à lista de pendentes
      pendingSubmissions.push(newMusic)
      
      resolve(newMusic)
    }, 1000)
  })
}

export function getPendingSubmissions(): Music[] {
  return pendingSubmissions
}

export function approveSubmission(id: string): Promise<Music> {
  return new Promise((resolve, reject) => {
    const submissionIndex = pendingSubmissions.findIndex(s => s.id === id)
    
    if (submissionIndex === -1) {
      reject(new Error('Submissão não encontrada'))
      return
    }
    
    const submission = {...pendingSubmissions[submissionIndex]}
    submission.status = 'approved'
    
    const now = new Date()
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    submission.reviewedAt = formattedDate
    submission.reviewedBy = 'Admin'
    
    // Remover da lista de pendentes
    pendingSubmissions = pendingSubmissions.filter(s => s.id !== id)
    
    // Adicionar à lista principal de músicas
    musicData.unshift(submission)
    
    resolve(submission)
  })
}

export function rejectSubmission(id: string, reason: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const submissionIndex = pendingSubmissions.findIndex(s => s.id === id)
    
    if (submissionIndex === -1) {
      reject(new Error('Submissão não encontrada'))
      return
    }
    
    const submission = pendingSubmissions[submissionIndex]
    submission.status = 'rejected'
    
    const now = new Date()
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    submission.reviewedAt = formattedDate
    submission.reviewedBy = 'Admin'
    submission.rejectionReason = reason
    
    // Remover da lista de pendentes
    pendingSubmissions = pendingSubmissions.filter(s => s.id !== id)
    
    resolve()
  })
}
