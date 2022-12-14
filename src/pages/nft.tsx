import { useState, useEffect, useContext, setState } from 'react';

import { NextSeo } from 'next-seo';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import type { NextPageWithLayout } from '@/types';

import DashboardLayout from '@/layouts/_dashboard';
import NFTGrid from '@/components/ui/nft-card';

import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';
import { useAccount } from 'wagmi';
import Button from '@/components/ui/button';


export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export const NFTsPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();

  const [metadata, setMetadata] = useState([]);

  useEffect(() => {
    if (isConnected) {
      fetchData();
    }
    if (isConnecting) {
      fetchData();
    }
  }, []);

  async function fetchData() {
    /*console.log('addressasf', walleta);*/
    const smartContract = ['0x0d108637481ac6838ce2daec7787393dc8b57fad'];

    await Moralis.start({
      apiKey:
        'tR2hnSTbvm2SvisXfmFQP3nCAc2WmV4XyNNngVrp20pMlRjyBbddNvtd38qRGrm9',
    });
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address: address,
      chain: EvmChain.BSC,
      tokenAddresses: smartContract,
    });

    setMetadata(response.toJSON());
    console.log(response);
    /*  console.log('raw', response.raw[0]);
      console.log('result', response.result[0]);
      console.log('value', response.result[0].value); */
  }

  if (isDisconnected) return <div>Disconnected - Please Connect Wallet</div>;

  return (
    <>
      <NextSeo
        title="Explore NTF"
        description="TikToken Web3 Dapp allows users to earn TT2E BSC tokens while using TikTok Social Network. The more TT2E Camera NFTs users own, the more they will maximise the earnings generated by their TikTok content"
      />
      {address ? (
        <div className="grid sm:pt-5 2xl:grid-cols-[280px_minmax(auto,_1fr)] 4xl:grid-cols-[320px_minmax(auto,_1fr)]">
          <div className="hidden border-dashed border-gray-200 ltr:border-r ltr:pr-8 rtl:border-l rtl:pl-8 dark:border-gray-700 2xl:block"></div>

          <div className="2xl:ltr:pl-10 2xl:rtl:pr-10 4xl:ltr:pl-12 4xl:rtl:pr-12">
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5">
              {metadata.map((nft) => (
                <NFTGrid
                  key={nft.tokenId}
                  name={nft.metadata.name}
                  image={nft.metadata.image}
                  author={nft.ownerOf}
                  /* authorImage={nft.authorImage}*/
                  collection={nft.metadata.description}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => openModal('WALLET_CONNECT_VIEW')}
          className="shadow-main hover:shadow-large"
        >
          CONNECT
        </Button>
      )}
    </>
  );
};

NFTsPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default NFTsPage;
