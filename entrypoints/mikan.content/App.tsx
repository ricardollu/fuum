import { Button } from '@/components/ui/button'
import { Bangumi, default_mikan, Mikan, MikanItem } from '@/lib/types'
import { BadgeMinus, BadgePlus, CircleX, DiamondPlus, RefreshCw, Tv } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import MikanView from '@/components/domain/MikanView'

// https://mikanani.me/Home/Bangumi/3373
export default () => {
  const [show, setShow] = useState(false)
  const [mikan, setMikan] = useState<Mikan>(default_mikan())
  const [bangumi, setBangumi] = useState<Bangumi>()
  const [, forceUpdate] = useReducer((x) => x + 1, 0) // https://legacy.reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate

  function addMikanSkip(item: MikanItem) {
    setMikan((prevMikan) => ({
      ...prevMikan,
      skip: [...prevMikan.skip, item],
    }))
  }

  let name = (document.querySelector('p.bangumi-title') as HTMLParagraphElement)?.innerText.trim()
  // 用bgm.tv的api获取中文名
  useEffect(() => {
    const bgmSubjectId = (document.querySelector("a[href^='https://bgm.tv/subject/']") as HTMLAnchorElement)?.href.split('/').pop()
    fetch('https://api.bgm.tv/v0/subjects/' + bgmSubjectId)
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res.name_cn) name = res.name_cn
        if (res) setBangumi(res)
      })
  }, [])

  return (
    <>
      <div className="fixed left-8 bottom-8 z-[999]">
        {show ? (
          <div className="w-[375px] h-[600px] bg-white rounded-lg">
            <div className="flex flex-row-reverse">
              <Button variant="ghost" className="flex items-center mx-2 my-2 " onClick={() => setShow(false)}>
                <CircleX />
              </Button>
            </div>
            <MikanView mikan={mikan} setMikan={setMikan} />
          </div>
        ) : (
          <>
            <Button className="rounded-full w-16 h-16">
              <Tv
                onClick={() => {
                  if (!mikan.name) {
                    alert('请先选择一个字幕组的rss')
                  } else {
                    setShow(true)
                  }
                }}
              />
            </Button>
            <Button className="rounded-full w-16 h-16 ml-4">
              <RefreshCw onClick={forceUpdate} />
            </Button>
          </>
        )}
      </div>
      {bangumi &&
        createPortal(
          <>
            <div>{`name_cn: ${bangumi.name_cn}`}</div>
            <div>{`eps: ${bangumi.eps}(${bangumi.total_episodes})`}</div>
            <div>{`rating: ${bangumi.rating.score}/${bangumi.rating.total}`}</div>
            <div>{`summary: ${bangumi.summary}`}</div>
          </>,
          document.querySelector("p.bangumi-info:has(> a[href^='https://bgm.tv/subject/'])") as Element,
        )}
      {Array.from(document.querySelectorAll('.central-container .subgroup-text'), (node) =>
        createPortal(
          <DiamondPlus
            size="14"
            onClick={() => {
              if (!show) setShow(true)
              setMikan({
                ...default_mikan(),
                name,
                url: (node.querySelector('a.mikan-rss') as HTMLAnchorElement).href,
              })
            }}
          />,
          node,
        ),
      )}
      {/* {Array.from(document.querySelectorAll('.central-container .subgroup-text + table thead tr'), (node) => createPortal(<th>添加</th>, node))}
      {Array.from(document.querySelectorAll('.central-container .subgroup-text + table thead tr'), (node) => createPortal(<th width={'5%'}>删除</th>, node))} */}
      {Array.from(document.querySelectorAll('.central-container .subgroup-text + table tbody tr'), (node) => {
        const title = (node.querySelector('td:nth-child(1) a:first-child') as HTMLAnchorElement).innerText
        const url = (node.querySelector('td:nth-child(4) a') as HTMLAnchorElement).href
        return createPortal(
          <td>
            <BadgePlus
              size="18"
              onClick={() => {
                if (!show) setShow(true)
                setMikan((prevMikan) => ({
                  ...prevMikan,
                  extra: [
                    ...prevMikan.extra,
                    {
                      title,
                      url,
                    },
                  ],
                }))
              }}
            />
          </td>,
          node,
        )
      })}
      {Array.from(document.querySelectorAll('.central-container .subgroup-text + table tbody tr'), (node) => {
        const title = (node.querySelector('td:nth-child(1) a:first-child') as HTMLAnchorElement).innerText
        const url = (node.querySelector('td:nth-child(4) a') as HTMLAnchorElement).href
        return createPortal(
          <td>
            <BadgeMinus
              size="18"
              onClick={() => {
                if (!show) setShow(true)
                addMikanSkip({ title, url })
              }}
            />
          </td>,
          node,
        )
      })}
    </>
  )
}
