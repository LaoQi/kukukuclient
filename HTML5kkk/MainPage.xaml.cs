using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Microsoft.Phone.Shell;
using System.ComponentModel;
using System.Windows.Controls.Primitives;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Threading.Tasks;
using Windows.Storage;
using System.IO;

namespace HTML5kkk
{
    public partial class MainPage : PhoneApplicationPage
    {
        // 主页的 Url
        private const string MainUri = "/Html/index.html";
        // 本地数据文件
        private const string LocalStorageFile = "";

        enum PageState
        {
            Threads,
            Image,
            Categroy
        }
        private PageState pageState = PageState.Threads;

        private BitmapImage bitImage;

        // 构造函数
        public MainPage()
        {
            InitializeComponent();
            InitalizeList();
        }

        // 初始化板块
        private void InitalizeList()
        {
            var list = new List<string> {
                "综合版1",
                "欢乐恶搞",
                "询问2",
                "推理",
                "技术宅",
                "料理",
                "貓版",
                "音乐",
                "体育",
                "军武",
                "模型",
                "考试",
                "数码",
                "日记",
                "速报",
                "动画",
                "漫画",
                "美漫",
                "轻小说",
                "小说",
                "二次创作",
                "VOCALOID",
                "东方Project",
                "辣鸡",
                "游戏",
                "EVE",
                "DNF",
                "战争雷霆",
                "扩散性百万亚瑟王",
                "LOL",
                "DOTA",
                "Minecraft",
                "MUG",
                "MUGEN",
                "WOT",
                "WOW",
                "D3",
                "卡牌桌游",
                "炉石传说",
                "怪物猎人",
                "口袋妖怪",
                "索尼",
                "任天堂",
                "日麻",
                "舰娘",
                "LoveLive",
                "辐射",
                "AKB",
                "COSPLAY",
                "影视",
                "摄影",
                "声优",
                "值班室"
            };
            Categroy.ItemsSource = list;
        }

        private string raw_data;

        private async Task ReadFile()
        {
            // Get the local folder.
            StorageFolder local = Windows.Storage.ApplicationData.Current.LocalFolder;

            if (local != null)
            {
                // Get the DataFolder folder.
                //var dataFolder = await local.GetFolderAsync("DataFolder");

                // Get the file.
                //var file = await dataFolder.OpenStreamForReadAsync("DataFile.txt");
                var file = await local.OpenStreamForReadAsync(LocalStorageFile);

                // Read the data.
                using (StreamReader streamReader = new StreamReader(file))
                {
                    this.raw_data = streamReader.ReadToEnd();
                }
            }
        }

        private async Task WriteToFile()
        {
            // Get the text data from the textbox. 
            byte[] fileBytes = System.Text.Encoding.UTF8.GetBytes(this.raw_data.ToCharArray());

            // Get the local folder.
            StorageFolder local = Windows.Storage.ApplicationData.Current.LocalFolder;

            // Create a new folder name DataFolder.
            //var dataFolder = await local.CreateFolderAsync("DataFolder",
            //    CreationCollisionOption.OpenIfExists);

            // Create a new file named DataFile.txt.
            //var file = await dataFolder.CreateFileAsync("DataFile.txt",
            //CreationCollisionOption.ReplaceExisting);

            var file = await local.CreateFileAsync(LocalStorageFile,
            CreationCollisionOption.ReplaceExisting);

            // Write the data from the textbox.
            using (var s = await file.OpenStreamForWriteAsync())
            {
                s.Write(fileBytes, 0, fileBytes.Length);
            }
        }

        private void Browser_Loaded(object sender, RoutedEventArgs e)
        {
            Browser.IsScriptEnabled = true;

            // 在此处添加 URL
            Browser.Navigate(new Uri(MainUri, UriKind.Relative));
        }

        // 捕获后退按键
        override protected void OnBackKeyPress(CancelEventArgs e)
        {
            if (pageState == PageState.Image)
            {
                ThreadLayer.Visibility = Visibility.Visible;
                ImageLayer.Visibility = Visibility.Collapsed;
                pageState = PageState.Threads;
                e.Cancel = true;
            } else if(pageState == PageState.Categroy)
            {
                Categroy.Visibility = Visibility.Collapsed;
                pageState = PageState.Threads;
                e.Cancel = true;
            } else if(pageState == PageState.Threads)
            {
                string cangoback = (string)Browser.InvokeScript("cangoback");
                if (cangoback == "yes")
                {
                    Browser.InvokeScript("backup");
                    e.Cancel = true;
                }
                else
                {
                    MessageBoxResult result = MessageBox.Show("确认退出？", "退出", MessageBoxButton.OKCancel);
                    if (result != MessageBoxResult.OK)
                    {
                        e.Cancel = true;
                    }
                }
            }
        }

        // 发串
        private void NewPostItem_Click(object sender, EventArgs e)
        {
            MessageBox.Show("发串");
        }

        private void SettingItem_Click(object sender, EventArgs e)
        {
            MessageBox.Show("设置");
        }

        // 打开串
        private void OpenThread(string threadno)
        {
            try
            {
                Browser.InvokeScript("openThreadNo", threadno);
            }
            catch (Exception se)
            {
                MessageBox.Show("Refresh Error:" + se.Message);
            }
        }

        //刷新
        private void RefreshItem_Click(object sender, EventArgs e)
        {
            try
            {
                Browser.InvokeScript("refresh");
            }
            catch (Exception se)
            {
                MessageBox.Show("Refresh Error:" + se.Message);
            }
        }

        // 打开图片
        private void OpenImage(string url)
        {
            //string destination = "/ImagePage.xaml?imgurl=" + url;
            //this.NavigationService.Navigate(new Uri(destination, UriKind.Relative));
            bitImage = new BitmapImage(new Uri(url, UriKind.RelativeOrAbsolute));
            bitImage.DownloadProgress += BitImage_DownloadProgress;
            bitImage.ImageOpened += BitImage_ImageOpened;
            Image.Source = bitImage;
            ImageLayer.Visibility = Visibility.Visible;
            ImageProgressBar.Visibility = Visibility.Visible;
            ThreadLayer.Visibility = Visibility.Collapsed;
            pageState = PageState.Image;
            Image_ResetTransform();
        }

        // 打开板块
        private void OpenForm(string ad)
        {
            try
            {
                Browser.InvokeScript("openCategroy", ad);
            }
            catch (Exception se)
            {
                MessageBox.Show("Refresh Error:" + se.Message);
            }
        }

        private void BitImage_ImageOpened(object sender, RoutedEventArgs e)
        {
            ImageProgressBar.Visibility = Visibility.Collapsed;
            ImageProgressBar.Value = 0;
        }

        private void BitImage_DownloadProgress(object sender, DownloadProgressEventArgs e)
        {
            ImageProgressBar.Value = e.Progress;
        }

        //跳转
        private void JumpToItem_Click(object sender, EventArgs e)
        {
            Popup p = new Popup();
            // Create some content to show in the popup. Typically you would 
            // create a user control.
            Border border = new Border();
            border.BorderBrush = new SolidColorBrush(Colors.Black);
            border.BorderThickness = new Thickness(5.0);

            StackPanel panel1 = new StackPanel();
            panel1.Background = new SolidColorBrush(Colors.LightGray);

            Button button1 = new Button();
            button1.Content = "Close";
            button1.Margin = new Thickness(5.0);
            button1.Click += new RoutedEventHandler((object ss, RoutedEventArgs ee) => { p.IsOpen = false; });
            TextBlock textblock1 = new TextBlock();
            textblock1.Text = "The popup control";
            textblock1.Margin = new Thickness(5.0);
            panel1.Children.Add(textblock1);
            panel1.Children.Add(button1);
            border.Child = panel1;

            // Set the Child property of Popup to the border 
            // which contains a stackpanel, textblock and button.
            p.Child = border;

            // Set where the popup will show up on the screen.
            p.VerticalOffset = 0;
            p.HorizontalOffset = 0;

            // Open the popup.
            p.IsOpen = true;
            
        }

        // 处理导航故障。
        private void Browser_NavigationFailed(object sender, System.Windows.Navigation.NavigationFailedEventArgs e)
        {
            MessageBox.Show("无法导航到此页面，请检查 Internet 连接");
        }

        private void Test_Click(object sender, EventArgs e)
        {
            string destination = "/PanoramaPage.xaml";
            NavigationService.Navigate(new Uri(destination, UriKind.Relative));
        }

        private void Browser_ScriptNotify(object sender, NotifyEventArgs e)
        {
            string[] data;
            try
            {
                data = e.Value.Split('#');
            } catch (Exception se)
            {
                MessageBox.Show("ScriptNotify Error @ " + se.ToString());
                return;
            }
            switch(data[0])
            {
                case "log":
                    MessageBox.Show(data[1]);
                    break;
                case "data":
                    break;
                case "image":
                    OpenImage(data[1]);
                    break;
                default:
                    break;
            }
        }

        private void Browser_Navigated(object sender, NavigationEventArgs e)
        {
            //MessageBox.Show("Navigated.............");
        }

        private void Browser_Navigating(object sender, NavigatingEventArgs e)
        {
            string url = e.Uri.ToString();
            switch (url)
            {
                case MainUri:
                    break;
                default:
                    e.Cancel = true;
                    break;
            }
            //MessageBox.Show(e.Uri.ToString());
        }

        private TranslateTransform trans = new TranslateTransform();
        private ScaleTransform scaletrans = new ScaleTransform();
        private double imageScale = 1;

        private void Image_SetTransform()
        {
            TransformCollection tc = new TransformCollection();
            tc.Add(scaletrans);
            tc.Add(trans);
            TransformGroup tg = new TransformGroup();
            tg.Children = tc;
            Image.RenderTransform = tg;
        }

        private void Image_ResetTransform()
        {
            trans.X = 0;
            trans.Y = 0;
            imageScale = 1;
            scaletrans.ScaleX = 1;
            scaletrans.ScaleY = 1;
            Image_SetTransform();
        }

        private void Image_DoubleTap(object sender, System.Windows.Input.GestureEventArgs e)
        {
            if (imageScale == 1 && ImageLayer.ActualWidth > Image.ActualWidth)
            {
                imageScale = ImageLayer.ActualWidth * 1.0 / Image.ActualWidth;
                double offset = (ImageLayer.ActualWidth - Image.ActualWidth) / 2;
                trans.X = -offset;
                scaletrans.ScaleX = imageScale;
                scaletrans.ScaleY = imageScale;
                Image_SetTransform();
            } else
            {
                Image_ResetTransform();
            }
        }
        
        private void Image_ManipulationDelta(object sender, System.Windows.Input.ManipulationDeltaEventArgs e)
        {
            //trans.X += e.DeltaManipulation.Translation.X;
            trans.Y += e.DeltaManipulation.Translation.Y * imageScale;
            Image_SetTransform();
            e.Handled = true;
        }

        private void Browser_ManipulationStarted(object sender, System.Windows.Input.ManipulationStartedEventArgs e)
        {

        }

        private void Browser_ManipulationDelta(object sender, System.Windows.Input.ManipulationDeltaEventArgs e)
        {
            if (e.DeltaManipulation.Translation.X > 0)
            {

            }
        }

        private void TextBlock_Tap(object sender, System.Windows.Input.GestureEventArgs e)
        {
            var ad = ((TextBlock)e.OriginalSource).Text;
            e.Handled = true;
            Categroy.Visibility = Visibility.Collapsed;
            OpenForm(ad);
            pageState = PageState.Threads;
        }

        private void Categroy_Click(object sender, EventArgs e)
        {
            pageState = PageState.Categroy;
            Categroy.Visibility = Visibility.Visible;
        }
    }
}
